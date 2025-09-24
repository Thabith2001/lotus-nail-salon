// app/api/memberships/route.js
import { NextResponse } from "next/server";

import Membership from "@/model/membershipsModel";
import {connectDB} from "@/lib/mongoose";

// ✅ GET all memberships
export async function GET() {
    await connectDB();
    try {
        const memberships = await Membership.find({});
        return NextResponse.json({ success: true, memberships }, { status: 200 });
    } catch (error) {
        console.error("GET memberships error:", error.message);
        return NextResponse.json(
            { success: false, error: "Failed to fetch memberships" },
            { status: 500 }
        );
    }
}

// ✅ POST: create a new membership
export async function POST(req) {
    await connectDB();
    try {
        const data = await req.json();

        // Required fields for memberships
        const requiredFields = ["name", "price", "description"];
        for (const field of requiredFields) {
            if (!data[field]) {
                return NextResponse.json(
                    { success: false, error: `${field} is required` },
                    { status: 400 }
                );
            }
        }

        const newMembership = new Membership(data);
        await newMembership.save();

        return NextResponse.json(
            { success: true, membership: newMembership },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST membership error:", error.message);
        return NextResponse.json(
            { success: false, error: "Failed to create membership" },
            { status: 500 }
        );
    }
}