import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/model/userModel";

export async function POST(req) {
    try {
        await connectDB();
        const { username, email, phone, password } = await req.json();


        if (!username || !email || !phone || !password) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { phone }],
        });
        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        await new User({
            username,
            email,
            phone,
            password,
        }).save();

        return NextResponse.json(
            { message: "User registered successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error(" Signup error:", error);

        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map((err) => err.message);
            return NextResponse.json({ message: errors[0] }, { status: 400 });
        }

        return NextResponse.json(
            { message: error.message || "Server error" },
            { status: 500 }
        );
    }
}
