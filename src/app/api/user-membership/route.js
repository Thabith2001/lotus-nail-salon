import {NextResponse} from "next/server";
import {connectDB} from "@/lib/mongoose";
import UserMembership from "@/model/userMembershipModel";


export async function GET(req) {
    await connectDB();
    try {
        const {searchParams} = new URL(req.url);
        const userId = searchParams.get("userId");

        const membership = await UserMembership.findOne({userId});

        if (!membership) {
            return NextResponse.json({
                success: false,
                message: "User membership not found"
            }, {status: 200});
        }

        return NextResponse.json({
            success: true,
            results: membership
        }, {status: 200});

    } catch (err) {
        return NextResponse.json({
            success: false,
            message: "Internal server error",
            error: err.message
        }, {status: 500});
    }
}


export async function POST(req) {
    await connectDB();
    try {
        const body = await req.json();
        const { userId, membershipPackage, startDate, endDate, remainingSessions, status, paymentId } = body;

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Missing userId" },
                { status: 400 }
            );
        }

        const updatedMembership = await UserMembership.findOneAndUpdate(
            { userId },
            {
                $set: {
                    membershipPackage,
                    startDate,
                    endDate,
                    remainingSessions,
                    status,
                    paymentId,
                },
            },
            { new: true, upsert: true }
        );

        return NextResponse.json(
            { success: true, results: updatedMembership },
            { status: 200 }
        );
    } catch (error) {
        console.error("POST membership error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to create/update membership" },
            { status: 500 }
        );
    }
}