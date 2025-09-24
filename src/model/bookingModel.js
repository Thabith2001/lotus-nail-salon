import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
    serviceId: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    rating: { type: Number, default: 0 },
    username: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: String, default: "pending" },
    bookingId:{type: String, required: true},
    paymentStatus: { type: String, default: "pending" },
    paymentMethod: { type: String, default: "credit_card" },
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);