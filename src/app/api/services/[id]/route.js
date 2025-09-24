// app/api/services/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Service from "@/model/serviceModel";

// GET a single service by ID
export async function GET(req, { params }) {
    await connectDB();
    try {
        const { id } = params;
        if (!id) return NextResponse.json({ error: "Service ID is required" }, { status: 400 });

        const service = await Service.findById(id);
        if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });

        return NextResponse.json({ success: true, service }, { status: 200 });
    } catch (error) {
        console.error("GET service error:", error);
        return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 });
    }
}

// PATCH: update a service by ID
export async function PATCH(req, { params }) {
    await connectDB();
    try {
        const { id } = params;
        const data = await req.json();

        const updatedService = await Service.findByIdAndUpdate(id, data, { new: true });
        if (!updatedService) return NextResponse.json({ error: "Service not found" }, { status: 404 });

        return NextResponse.json({ success: true, service: updatedService }, { status: 200 });
    } catch (error) {
        console.error("PATCH service error:", error);
        return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
    }
}

// DELETE: delete a service by ID
export async function DELETE(req, { params }) {
    await connectDB();
    try {
        const { id } = params;

        const deletedService = await Service.findByIdAndDelete(id);
        if (!deletedService) return NextResponse.json({ error: "Service not found" }, { status: 404 });

        return NextResponse.json({ success: true, message: "Service deleted" }, { status: 200 });
    } catch (error) {
        console.error("DELETE service error:", error);
        return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
    }
}