import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        category: {type: String, required: true},
        description: {type: String},
        duration: {type: String, required: true},
        price: {type: Number, required: true},
        subscription: {type: String, default: null},
        popular: {type: Boolean, default: false},
    },
    {timestamps: true}
);

export default mongoose.models.Service || mongoose.model("Service", serviceSchema);