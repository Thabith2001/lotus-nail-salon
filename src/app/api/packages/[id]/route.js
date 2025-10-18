import {NextResponse} from "next/server";
import {connectDB} from "@/lib/mongoose";
import Package from "@/model/packagesModel";

// GET package by ID
export async function GET(req, context) {
    await connectDB();
    try {
        const {id} = context.params;
        const packageItem = await Package.findById(id);
        if (!packageItem)
            return NextResponse.json({success: false, error: "Package not found"}, {status: 404});

        return NextResponse.json({success: true, package: packageItem}, {status: 200});
    } catch (error) {
        console.error("GET package error:", error.message);
        return NextResponse.json({success: false, error: "Failed to fetch package"}, {status: 500});
    }
}

// UPDATE package by ID
export async function PATCH(req, context) {
    await connectDB();
    try {
        const {id} = await context.params;
        const data = await req.json();
        const updatedPackage = await Package.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });

        if (!updatedPackage)
            return NextResponse.json({success: false, error: "Package not found"}, {status: 404});

        return NextResponse.json({success: true, package: updatedPackage}, {status: 200});
    } catch (error) {
        console.error("PUT package error:", error.message);
        return NextResponse.json({success: false, error: "Failed to update package"}, {status: 500});
    }
}

// DELETE package by ID
export async function DELETE(req, context) {
    const {id} = context.params;
    await connectDB();
    try {
        const deletedPackage = await Package.findByIdAndDelete(id);

        if (!deletedPackage)
            return NextResponse.json({success: false, error: "Package not found"}, {status: 404});

        return NextResponse.json({success: true, message: "Package deleted successfully"}, {status: 200});
    } catch (error) {
        console.error("DELETE package error:", error.message);
        return NextResponse.json({success: false, error: "Failed to delete package"}, {status: 500});
    }
}
