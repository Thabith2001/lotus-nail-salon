import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import UserMembership from "@/model/userMembershipModel";

// PATCH update membership
export async function PATCH(req, { params }) {
    await connectDB();

    try {
        const { id } = await params;
        const data = await req.json();

        const updated = await UserMembership.findByIdAndUpdate(id, data, {
            new: true,
        });

        if (!updated) {
            return NextResponse.json(
                { success: false, message: "Membership not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, results: updated },
            { status: 200 }
        );
    } catch (error) {
        console.error("PATCH membership error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to update membership",
                error: error.message,
            },
            { status: 500 }
        );
    }
}

// DELETE membership
export async function DELETE(req, { params }) {
    await connectDB();
    try {
        const { id } = params;
        const deleted = await UserMembership.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json(
                { success: false, message: "Membership not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Membership deleted" },
            { status: 200 }
        );
    } catch (error) {
        console.error("DELETE membership error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete membership", error: error.message },
            { status: 500 }
        );
    }
}