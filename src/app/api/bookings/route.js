
import { connectDB } from "@/lib/mongoose";
import Booking from "@/model/bookingModel";


export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const dateParam = searchParams.get("date");

        if (!dateParam) {
            return new Response(
                JSON.stringify({ error: "Missing date parameter" }),
                { status: 400 }
            );
        }

        // Fetch all bookings for that exact date
        const bookings = await Booking.find({ date: dateParam });

        // Map bookings to only needed fields
        const result = bookings.map((b) => ({
            username: b.username,
            email: b.email,
            phone: b.phone,
            date: b.date,
            time: b.time.slice(0, 5), // normalize to HH:MM
            service: b.name,
        }));

        return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch bookings" }),
            { status: 500 }
        );
    }
}

export async function POST(req) {
    await connectDB();

    try {
        // Parse incoming JSON
        const body = await req.json();

        // Optional: simple validation to see if required fields exist
        const requiredFields = ["serviceId", "date", "time", "username", "email", "phone","bookingId"];
        for (const field of requiredFields) {
            if (!body[field]) {
                return new Response(
                    JSON.stringify({ success: false, error: `${field} is required` }),
                    { status: 400, headers: { "Content-Type": "application/json" } }
                );
            }
        }


        const booking = new Booking(body);
        await booking.save();

        return new Response(
            JSON.stringify({ success: true, booking, _id: booking._id }),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error in POST /bookings:", error);
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }
}