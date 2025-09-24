import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import UserMembership from "@/model/userMembershipModel";

// GET a single membership
export async function GET(req, { params }) {
    await connectDB();
    try {
        const membership = await UserMembership.findById(params.id)
            .populate("userId", "username email")
            .populate("membershipPackageId", "name type price durationDays totalSessions perks")
            .populate("paymentId", "amount status method");

        if (!membership) return NextResponse.json({ error: "Membership not found" }, { status: 404 });

        return NextResponse.json({ success: true, membership }, { status: 200 });
    } catch (error) {
        console.error("GET membership error:", error);
        return NextResponse.json({ error: "Failed to fetch membership" }, { status: 500 });
    }
}

// PATCH: update membership
export async function PATCH(req, { params }) {
    await connectDB();
    try {
        const data = await req.json();

        const allowedFields = ["userId", "membershipPackageId", "startDate", "endDate", "remainingSessions", "status", "paymentId"];
        const updateData = {};
        allowedFields.forEach(field => {
            if (data[field] !== undefined) updateData[field] = data[field];
        });

        const updatedMembership = await UserMembership.findByIdAndUpdate(params.id, updateData, { new: true });
        if (!updatedMembership) return NextResponse.json({ error: "Membership not found" }, { status: 404 });

        return NextResponse.json({ success: true, membership: updatedMembership }, { status: 200 });
    } catch (error) {
        console.error("PATCH membership error:", error);
        return NextResponse.json({ error: "Failed to update membership" }, { status: 500 });
    }
}

// DELETE: delete membership
export async function DELETE(req, { params }) {
    await connectDB();
    try {
        const deletedMembership = await UserMembership.findByIdAndDelete(params.id);
        if (!deletedMembership) return NextResponse.json({ error: "Membership not found" }, { status: 404 });

        return NextResponse.json({ success: true, message: "Membership deleted" }, { status: 200 });
    } catch (error) {
        console.error("DELETE membership error:", error);
        return NextResponse.json({ error: "Failed to delete membership" }, { status: 500 });
    }
}