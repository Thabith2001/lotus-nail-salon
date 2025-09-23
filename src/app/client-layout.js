"use client";

import {AuthProvider} from "@/context/contextAuth";
import {AuthModalProvider, useAuthModal} from "@/context/authModelContext";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import {Toaster} from "react-hot-toast";
import Auth from "@/components/ui/auth";
import {DataProvider} from "@/helper/dataProvider";
import {usePathname} from "next/navigation";
import {useEffect, useState} from "react";
import {SessionProvider} from "next-auth/react";

function AuthModalWrapper() {
    const {isAuthOpen, closeAuth} = useAuthModal();
    return isAuthOpen ? <Auth setAuthOpen={closeAuth}/> : null;
}

export default function ClientLayout({children}) {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);


    useEffect(() => {
        setMounted(true);
    }, []);

    const hideHeaderFooter =
        pathname?.startsWith("/billing")
        || pathname?.startsWith("/appointment-details")
        || pathname?.startsWith("/admin")
        || pathname?.startsWith("/booking");


    return (
        <AuthProvider>
            <SessionProvider>
                <AuthModalProvider>
                    <DataProvider>
                        {mounted && !hideHeaderFooter && <Header/>}
                        {children}
                        {mounted && !hideHeaderFooter && <Footer/>}
                    </DataProvider>
                    <AuthModalWrapper/>
                    <Toaster position="top-center" reverseOrder={false}/>
                </AuthModalProvider>
            </SessionProvider>
        </AuthProvider>
    );
}
