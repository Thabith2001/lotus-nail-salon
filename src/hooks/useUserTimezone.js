"use client";
import { useState, useEffect } from "react";

export const useUserTimezone = () => {
    const [userTimezone, setUserTimezone] = useState("UTC");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            setUserTimezone(tz || "UTC");
        } catch {
            setUserTimezone("UTC");
        } finally {
            setLoading(false);
        }
    }, []);

    return { userTimezone, loading };
};
