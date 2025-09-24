// app/api/packages/[id]/route.js
import { NextResponse } from "next/server";
import {connectDB} from "@/lib/mongoose";
import Package from "@/model/packagesModel";

// ✅ GET single package by ID
export async function GET(req, { params }) {
    await connectDB();
    try {
        const pkg = await Package.findById(params.id);
        if (!pkg) {
            return NextResponse.json(
                { success: false, error: "Package not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({ success: true, package: pkg }, { status: 200 });
    } catch (error) {
        console.error("GET package error:", error.message);
        return NextResponse.json(
            { success: false, error: "Failed to fetch package" },
            { status: 500 }
        );
    }
}

// ✅ PATCH: update package
export async function PATCH(req, { params }) {
    await connectDB();
    try {
        const data = await req.json();

        // Allowed fields to update
        const allowedFields = [
            "name",
            "description",
            "price",
            "originalPrice",
            "savings",
            "duration",
            "services",
            "features",
            "recommended",
            "color",
        ];

        const updateData = {};
        allowedFields.forEach((field) => {
            if (data[field] !== undefined) updateData[field] = data[field];
        });

        const updatedPackage = await Package.findByIdAndUpdate(params.id, updateData, {
            new: true,
        });

        if (!updatedPackage) {
            return NextResponse.json(
                { success: false, error: "Package not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, package: updatedPackage }, { status: 200 });
    } catch (error) {
        console.error("PATCH package error:", error.message);
        return NextResponse.json(
            { success: false, error: "Failed to update package" },
            { status: 500 }
        );
    }
}

// ✅ DELETE: remove package
export async function DELETE(req, { params }) {
    await connectDB();
    try {
        const deletedPackage = await Package.findByIdAndDelete(params.id);
        if (!deletedPackage) {
            return NextResponse.json(
                { success: false, error: "Package not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { success: true, message: "Package deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("DELETE package error:", error.message);
        return NextResponse.json(
            { success: false, error: "Failed to delete package" },
            { status: 500 }
        );
    }
}