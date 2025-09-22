import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useGsap = ({ ref, animation, deps = [] }) => {
    useLayoutEffect(() => {
        if (!ref?.current) return;

        const ctx = gsap.context(() => {
            animation(gsap);
        }, ref);

        return () => ctx.revert();
    }, deps);
};