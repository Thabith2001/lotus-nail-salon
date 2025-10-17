import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Package from "@/model/packagesModel";

// ✅ GET all packages
export async function GET() {
    await connectDB();
    try {
        const packages = await Package.find({});
        return NextResponse.json({ success: true, packages }, { status: 200 });
    } catch (error) {
        console.error("GET packages error:", error.message);
        return NextResponse.json(
            { success: false, error: "Failed to fetch packages" },
            { status: 500 }
        );
    }
}

// ✅ POST: create a new package
export async function POST(req) {
    await connectDB();
    try {
        const data = await req.json();

        const requiredFields = ["id", "name", "price", "services"];
        for (const field of requiredFields) {
            if (!data[field]) {
                return NextResponse.json(
                    { success: false, error: `${field} is required` },
                    { status: 400 }
                );
            }
        }

        const newPackage = await Package.create(data);

        return NextResponse.json(
            { success: true, package: newPackage },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST package error:", error.message);
        return NextResponse.json(
            { success: false, error: "Failed to create package" },
            { status: 500 }
        );
    }
}
