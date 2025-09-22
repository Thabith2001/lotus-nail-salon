import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/model/userModel";

export async function POST(req) {
    try {
        await connectDB();
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "No user found with this email" }, { status: 404 });
        }

        // TODO: send reset email (using nodemailer / resend / twilio etc.)
        return NextResponse.json({ message: "Password reset link sent to email" });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
