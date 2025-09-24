
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "@/model/userModel";
import {connectDB} from "@/lib/mongoose";


export async function POST(req) {
    try {
        await connectDB();

        const { identifier, password } = await req.json();

        if (!identifier || !password) {
            return new Response(
                JSON.stringify({ message: "Missing fields" }),
                { status: 400 }
            );
        }


        const user = await User.findOne({
            $or: [{ email: identifier }, { phone: identifier }],
        }).select("+password");

        if (!user) {
            return new Response(
                JSON.stringify({ message: "User not found" }),
                { status: 404 }
            );
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return new Response(
                JSON.stringify({ message: "Invalid credentials" }),
                { status: 401 }
            );
        }

        // Create JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        user.password = undefined;

        return new Response(
            JSON.stringify({
                message: "Signed in successfully",
                token,
                user,
            }),
            { status: 200 }
        );
    } catch (err) {
        console.error("signin error:", err);
        return new Response(
            JSON.stringify({ message: "Server error", error: err.message }),
            { status: 500 }
        );
    }
}