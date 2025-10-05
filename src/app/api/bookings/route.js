import {NextResponse} from "next/server";
import Booking from "@/model/bookingModel";
import {connectDB} from "@/lib/mongoose";

export async function GET(req) {
    try {
        await connectDB();
        const {searchParams} = new URL(req.url);

        const userId = searchParams.get("userId");
        const dateParam = searchParams.get("date");


        const filter = {};
        if (dateParam) filter.bookingDate = dateParam;
        if (userId) filter.userId = userId;

        if (!dateParam && !userId) {
            return NextResponse.json(
                {error: "Please provide either 'date' or 'userId' parameter."},
                {status: 400}
            );
        }


        const bookings = await Booking.find(filter);

        if (dateParam && !userId) {
            const bookedTimes = bookings.map(b => b.time);
            return NextResponse.json(
                {date: dateParam, bookedTimes},
                {status: 200}
            );
        }


        return NextResponse.json({bookings}, {status: 200});

    } catch (err) {
        console.error("Error fetching bookings:", err);
        return NextResponse.json(
            {error: "Failed to fetch bookings"},
            {status: 500}
        );
    }
}


export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();


        const required = ["customerName", "email", "phone", "service", "bookingDate", "time"];
        for (const field of required) {
            if (!body[field]) {
                return NextResponse.json({
                    success: false, error: `${field} is required`
                }, {status: 400});
            }
        }


        const existing = await Booking.findOne({
            bookingId: body.bookingId,
        });

        if (existing) {
            return NextResponse.json({
                success: false, error: "Booking already exists", booking: existing
            }, {status: 409});
        }


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
            userMembershipId: body.membershipId,
            reasons: body.reasons,
            cancellationDate: null,
            status: body.status,
        });

        console.log("New booking created:", booking);
        await booking.save();

        return NextResponse.json({success: true, booking}, {status: 201});
    } catch (err) {
        console.error("POST booking error:", err);
        return NextResponse.json({
            success: false, error: "Failed to create booking"
        }, {status: 500});
    }
}