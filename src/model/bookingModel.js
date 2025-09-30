import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        bookingId: { type: String, required: true, unique: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        userMembershipId: { type: mongoose.Schema.Types.ObjectId, ref: "UserMembership", default: null }, // optional
        paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment", default: null },
        customerName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        service: { type: String, ref: "Service", required: true },
        bookingDate: { type: String, required: true },
        time: { type: String, required: true },
        paymentStatus: {
            type: String,
            enum: ["pending", "covered by membership", "completed", "succeeded", "failed"],
            default: "pending"
        },
        notes: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model("Booking", bookingSchema);