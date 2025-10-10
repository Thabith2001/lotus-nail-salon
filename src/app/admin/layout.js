'use client';

import { useRouter } from "next/navigation";
import { BookingsProvider } from "@/context/adminContext";
import { useAuth } from "@/context/authContext";
import { useEffect } from "react";

export default function Layout({ children }) {
    const router = useRouter();
    const { user } = useAuth();



    useEffect(() => {
        if (user && user.role !== "admin") {
            router.push("/");
        }

    }, [user, router]);

    if (!user) {
        return <p className="text-center mt-10">Checking admin access...</p>;
    }

    if (user.role !== "admin") {
        return <p className="text-center mt-10">Unauthorized. Redirecting...</p>;
    }

    return <BookingsProvider>{children}</BookingsProvider>;
}
