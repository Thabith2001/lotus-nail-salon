"use client";
import { createContext, useContext } from "react";
import { useUserTimezone } from "@/hooks/useUserTimezone";

const TimezoneContext = createContext({
    userTimezone: "UTC",
    loading: true,
});

export const TimezoneProvider = ({ children }) => {
    const { userTimezone, loading } = useUserTimezone();

    return (
        <TimezoneContext.Provider value={{ userTimezone, loading }}>
            {children}
        </TimezoneContext.Provider>
    );
};

export const useTimezone = () => useContext(TimezoneContext);
