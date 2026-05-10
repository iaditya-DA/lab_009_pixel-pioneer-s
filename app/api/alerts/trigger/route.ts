// /api/alerts/trigger.ts (or route.ts)

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import sgMail from "@sendgrid/mail";
import { getCurrentTimeInIST } from "@/lib/utils"; // Assuming a utility function for time formatting

// Define the expected body structure from the frontend
interface AlertRequestBody {
    alertLevel: 'Critical' | 'Severe' | 'Advisory';
    message: string;
    targetAreas: string;
}

export async function POST(req: NextRequest) {
    console.log("📌 [START] Disaster Alert Trigger API hit");

    // 🔐 1. Authentication Check
    await dbConnect();
    console.log("🔗 DB Connected");

    const session = await getServerSession(authOptions);
    
    // NOTE: Corrected authorization check. Assuming role is stored as 'userType' or 'role' in session/DB.
    // If your Mongoose User model uses 'userType' as per previous discussion, adjust accordingly.
    // Using a placeholder 'monasteryAdmin' check here. You might need to refine this based on your User model structure.
    const isAdmin = session?.user?.role === 'monasteryAdmin' || session?.user?.userType === 'monasteryAdmin';
    
    console.log("🧪 Session:", session?.user?.id ? "User authenticated" : "No session");
    console.log("🔑 Is Admin:", isAdmin);


    if (!session || !session.user?.id || !isAdmin) { 
        console.log("❌ Authorization failed: User is not an admin.");
        return NextResponse.json(
            { success: false, message: "Unauthorized. Only verified Monastery Administrators can send alerts." },
            { status: 401 }
        );
    }

    try {
        console.log("📥 Extracting alert data...");
        const { alertLevel, message, targetAreas }: AlertRequestBody = await req.json();

        // 2. Input Validation
        console.log("📝 Parsed Alert Data:", { alertLevel, targetAreas, message: message.substring(0, 30) + '...' });
        
        if (!message || !alertLevel || !targetAreas) {
            console.log("⚠ Missing required fields");
            return NextResponse.json(
                { success: false, message: "Missing alert message, level, or target areas." },
                { status: 400 }
            );
        }

        // 3. Set SendGrid API Key
        sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
        console.log("📨 SendGrid API Key added");

        const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL!;
        
        // 4. Fetch All Users for Bulk Email
        // Fetching all users who have an email to notify everyone on the platform.
        console.log("🔍 Fetching all user emails...");
        const allUsers = await User.find({ email: { $exists: true } }, 'email').lean();
        const recipientEmails = allUsers.map(user => user.email).filter(email => email);

        console.log(`👤 Total users found: ${allUsers.length}`);
        console.log(`📬 Emails to notify: ${recipientEmails.length}`);


        if (recipientEmails.length === 0) {
             console.log("⚠ No registered users found to send the alert.");
             return NextResponse.json(
                { success: true, message: "Alert triggered, but no users found for notification." },
                { status: 200 }
            );
        }

        // 5. Dynamic Email Styling based on Alert Level
        let alertColor = '';
        let emoji = '';
        let priorityStyle = '';

        if (alertLevel === 'Critical') {
            alertColor = '#DC2626'; // Red
            emoji = '🚨';
            priorityStyle = 'font-weight: bold; font-size: 18px; color: #DC2626;';
        } else if (alertLevel === 'Severe') {
            alertColor = '#F59E0B'; // Amber
            emoji = '⚠️';
            priorityStyle = 'font-weight: bold; font-size: 16px; color: #F59E0B;';
        } else {
            alertColor = '#10B981'; // Green (Advisory)
            emoji = '🔔';
            priorityStyle = 'font-weight: normal; font-size: 14px; color: #10B981;';
        }
        
        const currentISTTime = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });

        const subject = `${emoji} ${alertLevel.toUpperCase()} ALERT: ${message.substring(0, 50)}...`;
        console.log("✉ Email Subject:", subject);


        // 6. Generate Email Content
        const htmlContent = `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #ccc; border-radius: 8px; overflow: hidden;">
                <div style="background-color: ${alertColor}; color: white; padding: 20px; text-align: center;">
                    <h1 style="margin: 0; font-size: 28px;">${emoji} ${alertLevel.toUpperCase()} ALERT ${emoji}</h1>
                </div>
                <div style="padding: 25px; color: #333;">
                    <p style="font-size: 16px;">This is an immediate safety notification from the **Monastery360 Platform**.</p>
                    
                    <div style="margin: 20px 0; padding: 15px; border: 1px solid #eee; border-radius: 6px; background-color: #f9f9f9;">
                        <h3 style="color: #1F2937; margin-top: 0;">Message:</h3>
                        <p style="font-size: 18px; font-weight: bold; color: ${alertColor};">${message}</p>
                    </div>

                    <ul style="list-style-type: none; padding: 0;">
                        <li style="margin-bottom: 10px;"><strong>Area(s) Affected:</strong> ${targetAreas}</li>
                        <li style="margin-bottom: 10px; ${priorityStyle}"><strong>Alert Level:</strong> ${alertLevel}</li>
                        <li><strong>Time of Issue:</strong> ${currentISTTime} IST</li>
                    </ul>

                    <p style="margin-top: 20px; font-weight: bold; color: ${alertColor};">
                        ${alertLevel === 'Critical' ? '🛑 IMMEDIATE ACTION IS REQUIRED. DO NOT DELAY.' : 'Please exercise caution and follow local safety guidelines.'}
                    </p>
                    
                    <p style="font-size: 12px; color: #777; margin-top: 30px;">
                        This automated message was sent to all registered users of the Monastery360 platform.
                    </p>
                </div>
            </div>
        `;

        // 7. Construct and Send Bulk Messages
        const bulkMessages = recipientEmails.map(email => ({
            to: email,
            from: FROM_EMAIL,
            subject: subject,
            html: htmlContent,
            text: `${emoji} ${alertLevel} ALERT in ${targetAreas}: ${message} - Please check the website immediately for updates.`,
        }));
        
        await sgMail.send(bulkMessages);
        console.log(`🚀 Disaster Alert sent successfully to ${recipientEmails.length} recipients.`);

        return NextResponse.json(
            { success: true, message: "Disaster Alert successfully sent to all users." },
            { status: 200 }
        );

    } catch (error) {
        console.error("💥 API Error during disaster alert trigger:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error during alert processing." },
            { status: 500 }
        );
    }
}