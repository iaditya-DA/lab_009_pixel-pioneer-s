import { NextResponse } from "next/server";
import Razorpay from "razorpay";


export async function POST(req: Request) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_TEST_KEY_ID!,
      key_secret: process.env.RAZORPAY_TEST_KEY_SECRET!,
    });

    const { amount, currency = "INR", receipt } = await req.json();

    const options = {
      amount: amount , // amount in paise
      currency,
      receipt: receipt || "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(order);
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json(
      { error: "Unable to create order" },
      { status: 500 }
    );
  }
}
