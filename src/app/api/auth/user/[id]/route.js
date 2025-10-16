import {NextResponse} from "next/server";
import {connectDB} from "@/lib/mongoose";
import User from "@/model/userModel";
import mongoose from "mongoose";

export const GET = async (req, context) => {
    try {
        await connectDB();

        const {id} = await context.params;

        if (!id) {
            return NextResponse.json({error: "User ID is required"}, {status: 400});
        }

        console.log("Fetching user with ID:", id);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({error: "Invalid user ID"}, {status: 400});
        }

        const user = await User.findById(id).select("-password");

        if (!user) {
            console.log("User not found in DB");
            return NextResponse.json({error: "User not found"}, {status: 404});
        }

        return NextResponse.json({user}, {status: 200});
    } catch (err) {
        console.error("Error fetching user:", err);
        return NextResponse.json({error: err.message}, {status: 500});
    }
};

export const PATCH = async (req, context) => {
    try {
        await connectDB();

        const {id} = context.params;
        const data = await req.json();

        if (!id) {
            return NextResponse.json({message: "User ID not found"}, {status: 400});
        }

        if (!data || Object.keys(data).length === 0) {
            return NextResponse.json({message: "No data provided"}, {status: 400});
        }

        const updatedUser = await User.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });

        if (!updatedUser) {
            return NextResponse.json({message: "User not found"}, {status: 404});
        }

        return NextResponse.json(
            {message: "User updated successfully", user: updatedUser},
            {status: 200}
        );

    } catch (err) {
        console.error("PATCH error:", err);
        return NextResponse.json(
            {message: "Internal server error", error: err.message},
            {status: 500}
        );
    }
};

export const DELETE = async (req, { params }) => {
    try {
        await connectDB();

        const { id } = params;

        if (!id) {
            return NextResponse.json(
                { error: "User ID not provided" },
                { status: 400 }
            );
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "User deleted successfully" },
            { status: 200 }
        );
    } catch (err) {
        console.error("Error deleting user:", err);
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
};
