
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Payment from "@/model/paymentModel";

export async function GET(req, { params }) {
    await connectDB();
    try {
        const payment = await Payment.findById(params.id);
        if (!payment) return NextResponse.json({ error: "Payment not found" }, { status: 404 });
        return NextResponse.json({ success: true, payment }, { status: 200 });
    } catch (error) {
        console.error("GET payment error:", error);
        return NextResponse.json({ error: "Failed to fetch payment" }, { status: 500 });
    }
}

// PATCH: update payment
export async function PATCH(req, { params }) {
    await connectDB();
    try {
        const data = await req.json();

        const allowedFields = ["bookingId", "userMembershipId", "amount", "method", "status", "transactionId"];
        const updateData = {};
        allowedFields.forEach((field) => {
            if (data[field] !== undefined) updateData[field] = data[field];
        });

        const updatedPayment = await Payment.findByIdAndUpdate(params.id, updateData, { new: true });
        if (!updatedPayment) return NextResponse.json({ error: "Payment not found" }, { status: 404 });

        return NextResponse.json({ success: true, payment: updatedPayment }, { status: 200 });
    } catch (error) {
        console.error("PATCH payment error:", error);
        return NextResponse.json({ error: "Failed to update payment" }, { status: 500 });
    }
}

// DELETE: delete payment
export async function DELETE(req, { params }) {
    await connectDB();
    try {
        const deletedPayment = await Payment.findByIdAndDelete(params.id);
        if (!deletedPayment) return NextResponse.json({ error: "Payment not found" }, { status: 404 });

        return NextResponse.json({ success: true, message: "Payment deleted" }, { status: 200 });
    } catch (error) {
        console.error("DELETE payment error:", error);
        return NextResponse.json({ error: "Failed to delete payment" }, { status: 500 });
    }
}