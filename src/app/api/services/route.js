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
            name: data.name || 'Foot Treatment',
            category: data.category || 'Pedicure',
            description: data.description || 'Relaxing foot treatment with nail care and polish',
            duration: data.duration || '50',
            price: data.price || 55,
            subscription: data.subscription || 'individual',
            popular:data.popularity || false,
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
