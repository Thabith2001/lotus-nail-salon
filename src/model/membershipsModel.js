import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    subscription: { type: String, default: "membership" },
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    duration: Number,
    benefits: [String],
    features: [String],
    sessions:{type:String,default:null},
    recommended: { type: Boolean, default: false },
    color: String,
});

export default mongoose.models.Membership ||
mongoose.model("Membership", membershipSchema);