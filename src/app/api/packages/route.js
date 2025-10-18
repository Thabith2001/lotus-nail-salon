import {NextResponse} from "next/server";
import {connectDB} from "@/lib/mongoose";
import Package from "@/model/packagesModel";
import {randomUUID} from "crypto";

// ✅ GET all packages
export async function GET() {
    await connectDB();
    try {
        const packages = await Package.find({});
        return NextResponse.json({success: true, packages}, {status: 200});
    } catch (error) {
        console.error("GET packages error:", error.message);
        return NextResponse.json(
            {success: false, error: "Failed to fetch packages"},
            {status: 500}
        );
    }
}


export async function POST(req) {
    try {
        await connectDB();
        const data = await req.json();

        if (!data) {
            return NextResponse.json({ error: "No data provided" }, { status: 400 });
        }

        const packages = {
            id: randomUUID(),
            category: data.category,
            subscription: data.subscription,
            name: data.name,
            description: data.description,
            price: Number(data.price),
            originalPrice: Number(data.originalPrice),
            savings: Number(data.savings),
            duration: Number(data.duration),
            services: data.services || [],
            features: data.features || [],
            recommended: Boolean(data.recommended),
        };

        console.log("Packages to save:", packages);

        const newPackage = await Package.create(packages);

        return NextResponse.json({ success: "Successfully saved package", newPackage }, { status: 201 });
    } catch (error) {
        console.error("POST packages error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
