import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Payment from "@/model/paymentModel";

// GET all payments
export async function GET() {
    await connectDB();
    try {
        const payments = await Payment.find({}).populate("bookingId userMembershipId");
        return NextResponse.json({ success: true, payments }, { status: 200 });
    } catch (error) {
        console.error("GET payments error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch payments" }, { status: 500 });
    }
}

// POST create payment
export async function POST(req) {
    await connectDB();
    try {
        const data = await req.json();
        if (!data.amount) {
            return NextResponse.json({ success: false, error: "Amount is required" }, { status: 400 });
        }
        const payment = new Payment(data);
        await payment.save();
        return NextResponse.json({ success: true, payment }, { status: 201 });
    } catch (error) {
        console.error("POST payment error:", error);
        return NextResponse.json({ success: false, error: "Failed to create payment" }, { status: 500 });
    }
}