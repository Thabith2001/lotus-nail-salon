
import { NextResponse } from "next/server";

import Membership from "@/model/membershipsModel";
import {connectDB} from "@/lib/mongoose";

//  GET all memberships
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

//  POST: create a new membership
export const POST = async (req) => {
    try {
        await connectDB();

        const body = await req.json();

        const membership = {
            subscription: body.subscription,
            category: body.category,
            name: body.name,
            description: body.description,
            price: Number(body.price),
            originalPrice: Number(body.originalPrice),
            savings: Number(body.savings),
            benefits: body.benefits ,
            features: body.features ,
            sessions: body.sessions ,
            recommended: body.recommended ,
        };

        if(membership){
            const newMembership = await Membership.create(membership);
            return NextResponse.json(newMembership, { status: 201 });
        }

    } catch (error) {
        console.error("Error creating membership:", error);
        return NextResponse.json({ error: "Failed to create membership" }, { status: 500 });
    }
};
