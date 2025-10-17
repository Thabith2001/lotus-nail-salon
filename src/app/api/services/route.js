import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Service from "@/model/serviceModel";


export async function GET() {
    await connectDB();
    try {
        const services = await Service.find();
        return NextResponse.json({ success: true, services }, { status: 200 });
    } catch (error) {
        console.error("GET services error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch services" },
            { status: 500 }
        );
    }
}


export async function POST(req) {
    await connectDB();
    try {
        const data = await req.json();
        const { name, category, description, duration, price, subscription } = data;


        const requiredFields = ["name", "category", "duration", "price"];
        for (const field of requiredFields) {
            if (!data[field]) {
                return NextResponse.json(
                    { success: false, error: `${field} is required` },
                    { status: 400 }
                );
            }
        }

        const service = await Service.create({
            name,
            category,
            description,
            duration,
            price,
            subscription,
        });

        return NextResponse.json({ success: true, service }, { status: 201 });
    } catch (error) {
        console.error("POST service error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create service" },
            { status: 500 }
        );
    }
}
