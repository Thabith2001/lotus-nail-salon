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
        const {
            userId,
            membershipPackage,
            startDate,
            endDate,
            remainingSessions,
            status,
            paymentId,
            service,
            sessions
        } = body;

        // --- Validation ---
        if (!userId || !membershipPackage || !service) {
            return NextResponse.json(
                { success: false, message: "Missing required fields (userId, membershipPackage, or service)" },
                { status: 400 }
            );
        }

        // --- Create new membership ---
        const newMembership = await UserMembership.create({
            userId,
            membershipPackage,
            startDate,
            endDate,
            service,
            sessions: sessions || 1,
            remainingSessions: remainingSessions ?? (sessions || 1),
            status: status || "active",
            paymentId: paymentId || null,
        });

        return NextResponse.json(
            { success: true, results: newMembership },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST membership error:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to create membership",
            },
            { status: 500 }
        );
    }
}