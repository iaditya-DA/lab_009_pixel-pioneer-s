import { NextResponse,NextRequest } from "next/server";
import { uploadToCloudinary } from "@/lib/uploadCloudinary"; 
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import eventsModel from "@/models/eventsModel";
import User from "@/models/User";
import sgMail from "@sendgrid/mail";

export async function POST(req: NextRequest) {
    console.log("📌 [START] Event creation API hit");

    await dbConnect();
    console.log("🔗 DB Connected");

    const session = await getServerSession(authOptions);
    console.log("🧪 Session:", session?.user?.id ? "User authenticated" : "No session");

    if (!session || !session.user?.id) {
        console.log("❌ Authentication failed");
        return NextResponse.json(
            { success: false, message: "Not authenticated." },
            { status: 401 }
        );
    }

    try {
        console.log("📥 Extracting formData...");
        const formData = await req.formData();

        const eventName = formData.get("eventName") as string;
        const monasteryId = formData.get("monasteryId") as string;
        const description = formData.get("description") as string;
        const highlights = formData.get("highlights") as string;
        const startDate = formData.get("startDate") as string;
        const endDate = formData.get("endDate") as string;
        const time = formData.get("time") as string;
        const duration = formData.get("duration") as string;
        const location = formData.get("location") as string;
        const bookingAvailable = formData.get("bookingAvailable") === "true";
        const ticketPrice = parseFloat(formData.get("ticketPrice") as string) || 0;
        const totaltickets = parseInt(formData.get("totaltickets") as string, 10) || 0;

        console.log("📝 Parsed Form Data:", {
            eventName,
            monasteryId,
            startDate,
            endDate,
            time,
            duration,
            location,
            bookingAvailable,
            ticketPrice,
            totaltickets
        });

        const imageFiles = formData.getAll("images") as File[];
        console.log(`🖼 Total images received: ${imageFiles.length}`);

        if (!monasteryId || !eventName || !startDate) {
            console.log("⚠ Missing required fields");
            return NextResponse.json(
                { success: false, message: "Missing required fields." },
                { status: 400 }
            );
        }

        // ===== Uploading Images =====
        console.log("📤 Uploading images to Cloudinary...");
        const uploadPromises = imageFiles.map(file => uploadToCloudinary(file));
        const uploadResults = await Promise.allSettled(uploadPromises);

        const successfulUploads: string[] = [];
        uploadResults.forEach((res, i) => {
            if (res.status === "fulfilled") {
                console.log(`✅ Image ${i + 1} uploaded:`, res.value);
                successfulUploads.push(res.value);
            } else {
                console.log(`❌ Image ${i + 1} failed:`, res.reason);
            }
        });

        // ===== Preparing Event Data =====
        const eventDataToSave = {
            monasteryId,
            eventName,
            startDate,
            endDate,
            time,
            duration,
            location,
            description,
            highlights,
            images: successfulUploads,
            bookingAvailable,
            ticketPrice,
            totaltickets,
            userId: session.user.id,
        };

        console.log("📦 Final Event Data:", eventDataToSave);

        const savedEvent = await eventsModel.create(eventDataToSave);
        console.log("🎉 Event saved:", savedEvent._id);

        // Add to user's BookedEvents
        console.log("📌 Adding event to user profile...");
        await User.findByIdAndUpdate(
            session.user.id,
            { $push: { BookedEvents: savedEvent._id } },
            { new: true }
        );
        console.log("👌 Updated user's booked events");

        // ===== SendGrid Email Logic =====
        console.log("📧 Preparing to send bulk emails...");

        try {
            sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
            console.log("📨 SendGrid API Key added");

            const hotelierUsers = await User.find({ type: 'hotelier' }, 'email').lean();
            console.log(`🏨 Hoteliers found: ${hotelierUsers.length}`);

            const recipientEmails = hotelierUsers.map(u => u.email).filter(Boolean);

            if (recipientEmails.length > 0) {
                console.log("📬 Emails to notify:", recipientEmails.length);

                const monastery = await User.findById(monasteryId, 'name').lean(); 
                const monasteryName = (monastery as any)?.name || 'A local Monastery';

                console.log("🏯 Monastery:", monasteryName);

                const eventDate = new Date(startDate).toLocaleDateString('en-IN', {
                    year: 'numeric', month: 'long', day: 'numeric'
                });

                const eventDetailsUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/events/${savedEvent._id}`;

                const subject = `📢 Promotion Alert: New Event at ${monasteryName} on ${eventDate}`;
                console.log("✉ Email Subject:", subject);

                const htmlContent = `
                    <div style="font-family: sans-serif; padding: 20px;">
                        <h2>New Promotion Opportunity</h2>
                        <p>Event: ${eventName}</p>
                    </div>
                `;

                const bulkMessages = recipientEmails.map(email => ({
                    to: email,
                    from: process.env.SENDGRID_FROM_EMAIL!,
                    subject,
                    html: htmlContent,
                    text: `New Event: ${eventName} on ${eventDate}. Details: ${eventDetailsUrl}`,
                }));

                await sgMail.send(bulkMessages);
                console.log("🚀 Emails sent to hoteliers");

            } else {
                console.log("⚠ No hotelier emails found. Skipping email sending.");
            }
        } catch (emailErr) {
            console.error("❌ Email sending error:", emailErr);
        }

        return NextResponse.json(
            {
                success: true,
                message: "Event created successfully and hoteliers notified.",
                event: savedEvent,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("💥 API Error during event creation:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error." },
            { status: 500 }
        );
    }
}
