import {NextResponse} from "next/server";
import {connectDB} from "@/lib/mongoose";
import User from "@/model/userModel";

export async function GET(req) {
    try {
        await connectDB();

        const {searchParams} = new URL(req.url);
        const email = searchParams.get("email");

        if (email) {
            const user = await User.findOne({email}).select("-password");
            if (!user) {
                return NextResponse.json({error: "User not found"}, {status: 404});
            }
            return NextResponse.json({user}, {status: 200});
        } else {

            const users = await User.find().select("-password");
            return NextResponse.json({users: users}, {status: 200});
        }
    } catch (error) {
        console.error(" Error fetching user(s):", error);
        return NextResponse.json({error: "Server error"}, {status: 500});
    }
}
