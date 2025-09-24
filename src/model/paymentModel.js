import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
        userMembershipId: { type: mongoose.Schema.Types.ObjectId, ref: "UserMembership" },
        amount: { type: Number, required: true },
        method: { type: String, enum: ["credit_card", "cash", "stripe"], default: "credit_card" },
        status: { type: String, default: "pending" },
        transactionId: { type: String, default: null },
    },
    { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model("Payment", paymentSchema);