import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/dbConnect";
import ticketbookingModel from "@/models/ticketbookingModel";
import User from "@/models/User";
import sgMail from "@sendgrid/mail";
import QRCode from "qrcode";

export async function POST(req: Request) {
  try {
    await connectDB();

    // 🔐 Get logged-in user
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch user for email
    const user = await User.findById(userId);
    if (!user || !user.email) {
      console.group("User Not Found or Email Missing");
      return NextResponse.json(
        { error: "User email missing" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const {
      paymentId,
      orderId,
      signature,
      eventId,
      ticketPrice,
      numberOfPeople,
      totalAmount,
    } = body;

    if (!paymentId || !orderId || !signature) {
      return NextResponse.json(
        { error: "Missing payment details" },
        { status: 400 }
      );
    }

    // 🔹 Generate Ticket ID
    const ticketId = "TICKET-" + Date.now();

    // 💾 Save booking
    const booking = await ticketbookingModel.create({
      user: userId,
      event: eventId,
      date: new Date(),
      numberOfPeople,
      ticketPrice,
      totalAmount,
      orderId,
      paymentId,
      ticketId,
      paymentStatus: "success",
    });

    // 💌 Generate QR code for the ticket
    const qrData = `Ticket ID: ${ticketId}\nName: ${user.username || ''}\nEvent ID: ${eventId}\nPeople: ${numberOfPeople}`;
    const qrCodeImage = await QRCode.toDataURL(qrData); // Base64 image

    // 💌 Send Email via SendGrid
    try {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

      const msg = {
        to: user.email,
        from: process.env.SENDGRID_FROM_EMAIL!, // Verified sender
        subject: `🎉 Your Ticket Booking is Confirmed!`,
        text:
          `Hello ${user.username || ''},\n\n` +
          `Your booking was successful!\n` +
          `Ticket ID: ${ticketId}\n` +
          `People: ${numberOfPeople}\n` +
          `Amount: ₹${totalAmount}\n` +
          `Payment ID: ${paymentId}\n\n` +
          `Show this QR code at the event.\n\nThank you for booking 🙏`,
        html: `
          <h2>Booking Successful 🎉</h2>
          <p><strong>Ticket ID:</strong> ${ticketId}</p>
          <p><strong>People:</strong> ${numberOfPeople}</p>
          <p><strong>Amount:</strong> ₹${totalAmount}</p>
          <p><strong>Payment ID:</strong> ${paymentId}</p>
          <p>Show this QR code at the event:</p>
          <img src="${qrCodeImage}" alt="Ticket QR Code" />
          <p>Thank you for booking 🙏</p>
        `,
      };

      await sgMail.send(msg);
    } catch (emailErr) {
      console.error("Email Sending Failed:", emailErr);
    }

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Booking Error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
