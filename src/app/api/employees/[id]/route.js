import { connectDB } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import Employees from "@/model/employeesModel";


export const GET = async (req, { params }) => {
    try {
        await connectDB();
        const { id } = params;

        const employee = await Employees.findById(id);
        if (!employee)
            return NextResponse.json({ error: "Employee not found" }, { status: 404 });

        return NextResponse.json({ success: true, data: employee }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};


export const PATCH = async (req, { params }) => {
    try {
        await connectDB();
        const { id } = params;
        const body = await req.json();

        const updated = await Employees.findByIdAndUpdate(id, body, { new: true });
        if (!updated)
            return NextResponse.json({ error: "Employee not found" }, { status: 404 });

        return NextResponse.json({ success: true, message: "Employee updated", data: updated }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};


export const DELETE = async (req, { params }) => {
    try {
        await connectDB();
        const { id } = params;

        const deleted = await Employees.findByIdAndDelete(id);
        if (!deleted)
            return NextResponse.json({ error: "Employee not found" }, { status: 404 });

        return NextResponse.json({ success: true, message: "Employee deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};
