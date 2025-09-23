import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Booking from "@/model/bookingModel";

export async function GET(req) {
    await connectDB();
    try {
        const url = new URL(req.url);
        const dateQuery = url.searchParams.get("date");

        let filter = {};
        if (dateQuery) {
            const start = new Date(dateQuery);
            start.setHours(0,0,0,0);
            const end = new Date(dateQuery);
            end.setHours(23,59,59,999);
            filter.date = { $gte: start, $lte: end };
        }

        const bookings = await Booking.find(filter).sort({ time: 1 });
        return NextResponse.json(bookings, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
    }
}

export async function POST(req) {
    await connectDB();
    try {
        const data = await req.json();


        if (!data.service || !data.date || !data.time || !data.specialist || !data.customer) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newBooking = new Booking(data);
        await newBooking.save();

        return NextResponse.json(newBooking, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
    }

}
