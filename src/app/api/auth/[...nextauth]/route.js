import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { connectDB } from "@/lib/mongoose";
import User from "@/model/userModel";

export const authOptions = {
    session: { strategy: "jwt" },

    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                identifier: { label: "Email or Phone", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await connectDB();

                const user = await User.findOne({
                    $or: [
                        { email: credentials.identifier },
                        { phone: credentials.identifier },
                    ],
                }).select("+password");

                if (!user) throw new Error("No user found");

                const valid = await user.comparePassword(credentials.password);
                if (!valid) throw new Error("Invalid password");

                return {
                    id: user._id.toString(),
                    name: user.username,
                    email: user.email,
                    role: user.role,
                };
            },
        }),
    ],

    adapter: MongoDBAdapter(clientPromise, {
        databaseName: process.env.MONGODB_DB || "nailsalon",
    }),

    pages: { signIn: "/" },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
