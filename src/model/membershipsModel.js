import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema({
    subscription: {type: String, default: "membership"},
    category: {type: String, default: null},
    name: {type: String, required: true},
    description: String,
    price: {type: Number, required: true},
    originalPrice: Number,
    duration: Number,
    savings: Number,
    benefits: [String],
    features: [String],
    sessions: {type: String, default: null},
    recommended: {type: Boolean, default: false},

});

export default mongoose.models.Membership ||
mongoose.model("Membership", membershipSchema);