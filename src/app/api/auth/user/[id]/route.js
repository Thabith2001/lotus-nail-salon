import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/model/userModel";
import mongoose from "mongoose";

export const GET = async (req, context) => {
    try {
        await connectDB();

        const { id } = await context.params;

        if (!id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        console.log("Fetching user with ID:", id);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        const user = await User.findById(id).select("-password");

        if (!user) {
            console.log("User not found in DB");
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user }, { status: 200 });
    } catch (err) {
        console.error("Error fetching user:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
};