"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/context/authContext";
import { AuthModalProvider, useAuthModal } from "@/context/authModelContext";
import { BookingsProvider } from "@/context/adminContext";
import { DataProvider } from "@/helper/dataProvider";
import { TimezoneProvider } from "@/context/TimeZoneContext";

import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import Auth from "@/components/ui/auth";
import { Toaster } from "react-hot-toast";

// Handles auth modal rendering
function AuthModalWrapper() {
    const { isAuthOpen, closeAuth } = useAuthModal();
    return isAuthOpen ? <Auth setAuthOpen={closeAuth} /> : null;
}

export default function ClientLayout({ children }) {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Hide header/footer on specific routes
    const hideHeaderFooter =
        pathname?.startsWith("/billing") ||
        pathname?.startsWith("/appointment-details") ||
        pathname?.startsWith("/admin") ||
        pathname?.startsWith("/booking");

    return (
        <SessionProvider>
            <AuthProvider>
                <AuthModalProvider>
                    <BookingsProvider>
                        <DataProvider>
                            <TimezoneProvider>
                                {mounted && !hideHeaderFooter && <Header />}
                                {children}
                                {mounted && !hideHeaderFooter && <Footer />}
                            </TimezoneProvider>
                        </DataProvider>
                        <AuthModalWrapper />
                        <Toaster position="top-center" reverseOrder={false} />
                    </BookingsProvider>
                </AuthModalProvider>
            </AuthProvider>
        </SessionProvider>
    );
}