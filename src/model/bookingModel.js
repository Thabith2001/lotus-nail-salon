import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        service: {
            id: { type: String, required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            duration: { type: Number, required: true },
            category: { type: String },
        },
        date: { type: Date, required: true },
        time: { type: String, required: true },
        specialist: {
            id: { type: String, required: true },
            name: { type: String, required: true },
            specialty: { type: String },
        },
        customer: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
            notes: { type: String },
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "completed", "canceled"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model("Booking", bookingSchema);