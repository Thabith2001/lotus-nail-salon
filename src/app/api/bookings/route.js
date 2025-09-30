import {NextResponse} from "next/server";
import Booking from "@/model/bookingModel";
import {connectDB} from "@/lib/mongoose";


export async function GET(req) {
    try {
        await connectDB();
        const {searchParams} = new URL(req.url);
        const dateParam = searchParams.get("date");

        if (!dateParam) {
            return NextResponse.json({error: "Missing date parameter"},{ status: 400});
        }

        // Query by exact bookingDate (string)
        const bookings = await Booking.find({bookingDate: dateParam}).select("time -_id");

        // Extract only the booked times
        const bookedTimes = bookings.map(b => b.time);

        return NextResponse.json({date: dateParam, bookedTimes}, {status: 200});
    } catch (err) {
        console.error("Error fetching booked times:", err);
        return NextResponse.json({error: "Failed to fetch booked times"}, {status: 500});
    }
}


// POST new booking
export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();

        // Required fields
        const required = ["customerName", "email", "phone", "service", "bookingDate", "time"];
        for (const field of required) {
            if (!body[field]) {
                return NextResponse.json({
                    success: false, error: `${field} is required`}, {status: 400});
            }
        }

        // Check if booking already exists (to prevent duplicates)
        const existing = await Booking.findOne({
            bookingId: body.bookingId,
        });

        if (existing) {
            return NextResponse.json({
                success: false, error: "Booking already exists", booking: existing}, {status: 409});
        }

        // Create new booking
        const booking = new Booking({
            bookingId: body.bookingId,
            customerName: body.customerName,
            email: body.email,
            phone: body.phone,
            service: body.service,
            bookingDate: body.bookingDate,
            time: body.time,
            paymentStatus: body.paymentStatus,
            userId: body.userId,
            paymentId: body.paymentId,
            userMembershipId:body.membershipId,
        });

        console.log("New booking created:", booking);
         await booking.save();

        return NextResponse.json({success: true, booking}, {status: 201});
    } catch (err) {
        console.error("POST booking error:", err);
        return NextResponse.json({
            success: false, error: "Failed to create booking"}, {status: 500});
    }
}