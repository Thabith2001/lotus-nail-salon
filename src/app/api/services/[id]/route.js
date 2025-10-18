import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Service from "@/model/serviceModel";


export async function GET(req, context) {
    await connectDB();
    try {
        const { id } = context.params;
        const service = await Service.findById(id);
        if (!service) {
            return NextResponse.json(
                { success: false, error: "Service not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({ success: true, service }, { status: 200 });
    } catch (error) {
        console.error("GET service by ID error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch service" },
            { status: 500 }
        );
    }
}


export async function PATCH(req, context) {
    await connectDB();
    try {
        const { id } = context.params;
        const data = await req.json();

        console.log("Received data:", data);
        const updatedService = await Service.findByIdAndUpdate(id, {
            name: data.name || 'Foot Treatment',
            category: data.category || 'Pedicure',
            description: data.description || 'Relaxing foot treatment with nail care and polish',
            duration: data.duration || '50',
            price: data.price || 55,
            subscription: data.subscription || 'individual',
            popular:data.popularity || false,
        }, {
            new: true,
            runValidators: true,
        });

        if (!updatedService) {
            return NextResponse.json(
                { success: false, error: "Service not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, service: updatedService }, { status: 200 });
    } catch (error) {
        console.error("PUT service error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update service" },
            { status: 500 }
        );
    }
}


export async function DELETE(req, context) {
    await connectDB();
    try {
        const { id } = context.params;
        const deletedService = await Service.findByIdAndDelete(id);

        if (!deletedService) {
            return NextResponse.json(
                { success: false, error: "Service not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Service deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("DELETE service error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete service" },
            { status: 500 }
        );
    }
}
