
import { NextResponse } from "next/server";

import Membership from "@/model/membershipsModel";
import {connectDB} from "@/lib/mongoose";

// ✅ GET single membership by ID
export async function GET(req, { params }) {
    await connectDB();
    try {
        const membership = await Membership.findById(params.id);
        if (!membership)
            return NextResponse.json({ error: "Membership not found" }, { status: 404 });

        return NextResponse.json({ success: true, membership }, { status: 200 });
    } catch (error) {
        console.error("GET membership error:", error);
        return NextResponse.json(
            { error: "Failed to fetch membership" },
            { status: 500 }
        );
    }
}

// ✅ PATCH: update membership
export async function PATCH(req, { params }) {
    await connectDB();
    try {
        const data = await req.json();

        // Only allow updates to these fields
        const allowedFields = [
            "name",
            "description",
            "price",
            "duration", // in days/months
            "benefits",
            "recommended",
            "color",
        ];
        const updateData = {};
        allowedFields.forEach((field) => {
            if (data[field] !== undefined) updateData[field] = data[field];
        });

        const updatedMembership = await Membership.findByIdAndUpdate(
            params.id,
            updateData,
            { new: true }
        );

        if (!updatedMembership)
            return NextResponse.json({ error: "Membership not found" }, { status: 404 });

        return NextResponse.json({ success: true, membership: updatedMembership }, { status: 200 });
    } catch (error) {
        console.error("PATCH membership error:", error);
        return NextResponse.json(
            { error: "Failed to update membership" },
            { status: 500 }
        );
    }
}

// ✅ DELETE: delete membership
export async function DELETE(req, { params }) {
    await connectDB();
    try {
        const deletedMembership = await Membership.findByIdAndDelete(params.id);
        if (!deletedMembership)
            return NextResponse.json({ error: "Membership not found" }, { status: 404 });

        return NextResponse.json(
            { success: true, message: "Membership deleted" },
            { status: 200 }
        );
    } catch (error) {
        console.error("DELETE membership error:", error);
        return NextResponse.json(
            { error: "Failed to delete membership" },
            { status: 500 }
        );
    }
}