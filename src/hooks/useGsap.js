"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useGsap(ref, div) {
    useEffect(() => {
        if (!ref?.current) return;

        const ctx = gsap.context(() => {
            const q = gsap.utils.selector(ref);

            q(div).forEach((el) => {
                gsap.fromTo(
                    el,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: "power4.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 90%",
                            toggleActions: "play none none reverse",
                        },
                    }
                );
            });
        }, ref);

        // Optional refresh (only needed if you have late-loading content/images)
        ScrollTrigger.refresh();

        return () => ctx.revert(); // ✅ clean up only this component’s animations
    }, [ref, div]);
}
