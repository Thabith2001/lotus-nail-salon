
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Service from "@/model/serviceModel";

// GET all services
export async function GET() {
    await connectDB();
    try {
        const services = await Service.find();
        return NextResponse.json({ success: true, services }, { status: 200 });
    } catch (error) {
        console.error("GET services error:", error);
        return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
    }
}

// POST: create a new service
export async function POST(req) {
    await connectDB();
    try {
        const data = await req.json();

        // Optional: basic validation
        const requiredFields = ["name", "price", "duration", "category"];
        for (const field of requiredFields) {
            if (!data[field]) {
                return NextResponse.json({ success: false, error: `${field} is required` }, { status: 400 });
            }
        }

        const newService = new Service(data);
        await newService.save();

        return NextResponse.json({ success: true, service: newService }, { status: 201 });
    } catch (error) {
        console.error("POST service error:", error);
        return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
    }
}