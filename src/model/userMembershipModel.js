import mongoose from "mongoose";

const userMembershipSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        membershipPackageId: { type: mongoose.Schema.Types.ObjectId, ref: "MembershipPackage", required: true },
        startDate: { type: String, default: Date.now },
        endDate: { type: String, default: Date.now },
        remainingSessions: { type: Number, default: null },
        status: { type: String, enum: ["active", "expired"], default: "active" },
        paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    },
    { timestamps: true }
);

export default mongoose.models.UserMembership || mongoose.model("UserMembership", userMembershipSchema);