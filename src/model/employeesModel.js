import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const employeesSchema = new mongoose.Schema(
    {
        employeeName: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        phone: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true, minlength: 6, select: false },
        department: { type: String, required: true },
        position: { type: String, required: true },
        salary: { type: Number, required: true },
        hireDate: { type: String, default: Date.now },
        leaveDate: { type: String, default: null },
        employeeStatus: { type: String, enum: ["active", "inactive"], default: "active" },
        role: { type: String, default: "employee" },
    },
    { timestamps: true }
);

// Hash password before save
employeesSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare passwords
employeesSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.Employees || mongoose.model("Employees", employeesSchema);