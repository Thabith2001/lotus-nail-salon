import {connectDB} from "@/lib/mongoose";
import {NextResponse} from "next/server";
import Employees from "@/model/employeesModel";

export const GET = async (req, { params }) => {
    try {
        await connectDB();
        const { id } = params || {};

        if (id) {
            const employee = await Employees.findById(id);
            if (!employee)
                return NextResponse.json({ error: "Employee not found" }, { status: 404 });

            return NextResponse.json({ success: true, data: employee }, { status: 200 });
        }

        const employees = await Employees.find();
        if (!employees || employees.length === 0)
            return NextResponse.json({ error: "No employees found" }, { status: 404 });

        return NextResponse.json({ success: true, data: employees }, { status: 200 });
    } catch (error) {
        console.error("Error fetching employees:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};

export const POST = async (req) => {
    try {
        await connectDB();
        const body = await req.json();
        const {
            employeeName,
            email,
            phone,
            password,
            department,
            position,
            salary,
            hireDate,
            leaveDate,
            employeeStatus,
            role
        } = body;

        if (!employeeName || !email || !phone || !password || !department || !position || !salary || !hireDate) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        const existingEmployee = await Employees.findOne({
            $or: [{ email }, { phone }],
        });

        if (existingEmployee) {
            return NextResponse.json(
                { message: "Employee already exists" },
                { status: 400 }
            );
        }

        const cleanedPhone = phone.replace(/\s+/g, '');

        const newEmployee = await Employees.create({
            employeeName,
            email,
            phone: cleanedPhone,
            password,
            department,
            position,
            salary,
            hireDate,
            leaveDate,
            employeeStatus,
            role
        });

        return NextResponse.json(
            {
                success: true,
                message: "Successfully registered employee",
                employee: newEmployee,
            },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};
