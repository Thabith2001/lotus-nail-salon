"use client";
import { useEffect, useState } from "react";

export function useSparkles(count) {
    const [sparkles, setSparkles] = useState([]);

    useEffect(() => {
        const newSparkles = Array.from({ length: count }).map(() => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            delay: `${Math.random() * 3}s`,
            duration: `${2 + Math.random() * 2}s`,
        }));
        setSparkles(newSparkles);
    }, [count]);

    return sparkles;
}