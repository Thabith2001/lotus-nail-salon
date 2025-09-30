
import { NextResponse } from "next/server";
import {connectDB} from "@/lib/mongoose";
import User from "@/model/userModel";

export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json({ error: "Email query parameter is required" }, { status: 400 });
        }
        const user = await User.findOne({ email: email }).select("-password");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        console.error({error:"Error finding user:"}, error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
