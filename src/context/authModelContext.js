
"use client";
import { createContext, useContext, useState } from "react";

const AuthModalContext = createContext();

export const AuthModalProvider = ({ children }) => {
    const [isAuthOpen, setIsAuthOpen] = useState(false);

    const openAuth = () => setIsAuthOpen(true);
    const closeAuth = () => setIsAuthOpen(false);

    return (
        <AuthModalContext.Provider value={{ isAuthOpen, openAuth, closeAuth }}>
            {children}
        </AuthModalContext.Provider>
    );
};

export const useAuthModal = () => useContext(AuthModalContext);


