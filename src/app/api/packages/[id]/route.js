import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Package from "@/model/packagesModel";

// GET package by ID
export async function GET(req, { params }) {
    await connectDB();
    try {
        const packageItem = await Package.findById(params.id);
        if (!packageItem)
            return NextResponse.json({ success: false, error: "Package not found" }, { status: 404 });

        return NextResponse.json({ success: true, package: packageItem }, { status: 200 });
    } catch (error) {
        console.error("GET package error:", error.message);
        return NextResponse.json({ success: false, error: "Failed to fetch package" }, { status: 500 });
    }
}

// UPDATE package by ID
export async function PUT(req, { params }) {
    await connectDB();
    try {
        const data = await req.json();
        const updatedPackage = await Package.findByIdAndUpdate(params.id, data, {
            new: true,
            runValidators: true,
        });

        if (!updatedPackage)
            return NextResponse.json({ success: false, error: "Package not found" }, { status: 404 });

        return NextResponse.json({ success: true, package: updatedPackage }, { status: 200 });
    } catch (error) {
        console.error("PUT package error:", error.message);
        return NextResponse.json({ success: false, error: "Failed to update package" }, { status: 500 });
    }
}

// DELETE package by ID
export async function DELETE(req, { params }) {
    await connectDB();
    try {
        const deletedPackage = await Package.findByIdAndDelete(params.id);

        if (!deletedPackage)
            return NextResponse.json({ success: false, error: "Package not found" }, { status: 404 });

        return NextResponse.json({ success: true, message: "Package deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("DELETE package error:", error.message);
        return NextResponse.json({ success: false, error: "Failed to delete package" }, { status: 500 });
    }
}
