import mongoose from "mongoose";

const userMembershipSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        membershipPackage: { type: String, enum: ["membership", "package"], required: true },
        startDate: { type: Date, default: Date.now },
        endDate: { type: Date },
        remainingSessions: { type: Number, default: 0 },
        status: { type: String, enum: ["active", "expired"], default: "active" },
        paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    },
    { timestamps: true }
);


export default mongoose.models.UserMembership || mongoose.model("UserMembership", userMembershipSchema);