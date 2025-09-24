import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    subscription: { type: String, default: "package" },
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    originalPrice: Number,
    savings: Number,
    duration: Number,
    popularity: String,
    services: [String],
    features: [String],
    recommended: { type: Boolean, default: false },
    color: String,
});

export default mongoose.models.Package ||
mongoose.model("Package", packageSchema);