
import {Montserrat ,Inter_Tight} from "next/font/google";
import "@/styles/global.css";


const inter_Tight = Inter_Tight({
    weight: ["400", "500", "600", "700"],
    subsets:["cyrillic"],
    variable: "--font-inter-tight",
    display: "swap",
})

const montserrat = Montserrat({
    weight: ["400", "500", "600", "700"],
    subsets:["cyrillic"],
    variable: "--font-montserrat",
    display: "swap",
})



export const metadata = {
    title: "Lotus Salon",
    description: "Luxury Nail Salon - Pamper Yourself with Elegance and Style",
    icons: {
        icon: "/images/lotus_logo.png",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${inter_Tight.variable}`}>
        <body className="font-sans">

        <ClientLayout>{children}</ClientLayout>
        </body>
        </html>
    );
}


import ClientLayout from "./client-layout";
