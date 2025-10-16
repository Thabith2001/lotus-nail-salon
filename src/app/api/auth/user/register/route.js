import {NextResponse} from "next/server";
import User from "@/model/userModel";
import {connectDB} from "@/lib/mongoose";

export async function POST(req) {
    await connectDB();
    try {
        const body = await req.json();
        const { username, email, phone, password } = body;


        if (!username || !email || !phone || !password) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        // Check if user already exists (by email or phone)
        const existingUser = await User.findOne({
            $or: [{ email }, { phone }],
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        // Clean phone number & create new user
        const cleanedPhone = phone.replace(/\s+/g, '');
        const user = await User.create({
            username,
            email,
            phone: cleanedPhone,
            password,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Successfully registered",
                user,
            },
            { status: 201 }
        );
    } catch (err) {

        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    await connectDB();
    try {
        const users = await User.find();
        return NextResponse.json({success: true, users});
    } catch (err) {
        return NextResponse.json({success: false, error: err});
    }
}