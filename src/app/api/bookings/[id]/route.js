import {NextResponse} from "next/server";
import {connectDB} from "@/lib/mongoose";
import Booking from "@/model/bookingModel";

export async function GET(req, {params}) {
    await connectDB();
    try {
        const booking = await Booking.findById(params.id);
        if (!booking) return NextResponse.json({error: "Booking not found"}, {status: 404});
        return NextResponse.json(booking, {status: 200});
    } catch (error) {
        return NextResponse.json({error: "Failed to fetch booking"}, {status: 500});
    }
}

export async function PATCH(req, {params}) {
    await connectDB();
    const {id} = await params;

    if(!id) return NextResponse.json({error: "Booking ID is required"}, {status: 400});
    try {
        const data = await req.json();
        const updatedBooking = await Booking.findByIdAndUpdate(id, data, {new: true});
        if (!updatedBooking) return NextResponse.json({error: "Booking not found"}, {status: 404});
        return NextResponse.json(updatedBooking, {status: 200});
    } catch (error) {
        return NextResponse.json({error: "Failed to update booking"}, {status: 500});
    }
}

export async function DELETE(req, {params}) {
    await connectDB();
    try {
        const deletedBooking = await Booking.findByIdAndDelete(params.id);
        if (!deletedBooking) return NextResponse.json({error: "Booking not found"}, {status: 404});
        return NextResponse.json({message: "Booking deleted"}, {status: 200});
    } catch (error) {
        return NextResponse.json({error: "Failed to delete booking"}, {status: 500});
    }
}