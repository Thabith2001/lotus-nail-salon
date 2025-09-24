import mongoose from "mongoose";

const membershipPackageSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        type: {type: String, enum: ["membership", "package"], required: true},
        description: {type: String},
        price: {type: Number, required: true},
        durationDays: {type: Number, default: null},
        totalSessions: {type: Number, default: null},
        perks: {type: [String], default: []},
    },
    {timestamps: true}
);

export default mongoose.models.MembershipPackage || mongoose.model("MembershipPackages", membershipPackageSchema);