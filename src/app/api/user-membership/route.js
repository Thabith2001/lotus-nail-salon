import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import UserMembership from "@/model/userMembershipModel";

// GET all user memberships
export async function GET() {
    await connectDB();
    try {
        const memberships = await UserMembership.find({})
            .populate("userId", "username email")
            .populate("membershipPackageId", "name type price durationDays totalSessions perks")
            .populate("paymentId", "amount status method");
        return NextResponse.json({ success: true, memberships }, { status: 200 });
    } catch (error) {
        console.error("GET memberships error:", error);
        return NextResponse.json({ error: "Failed to fetch memberships" }, { status: 500 });
    }
}

// POST: create a new user membership
export async function POST(req) {
    await connectDB();
    try {
        const data = await req.json();

        // Basic validation
        if (!data.userId || !data.membershipPackageId) {
            return NextResponse.json({ success: false, error: "userId and membershipPackageId are required" }, { status: 400 });
        }

        const newMembership = new UserMembership(data);
        await newMembership.save();

        return NextResponse.json({ success: true, membership: newMembership }, { status: 201 });
    } catch (error) {
        console.error("POST membership error:", error);
        return NextResponse.json({ error: "Failed to create membership" }, { status: 500 });
    }
}