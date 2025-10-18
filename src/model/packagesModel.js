import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
    id:{type: Object, required: true},
    category: { type: String, default: null },
    subscription: { type: String, default: "package" },
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    originalPrice: Number,
    savings: Number,
    duration: Number,
    services: [String],
    features: [String],
    recommended: { type: Boolean, default: false },

});

export default mongoose.models.Package ||
mongoose.model("Package", packageSchema);