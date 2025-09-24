import React from 'react';
import Home from "@/components/ui/home";
import About from "@/components/ui/about";
import Services from "@/components/ui/services";
import Gallery from "@/components/ui/gallery";
import Pricing from "@/components/ui/pricing";
import Blog from "@/components/ui/blog";
import Contact from "@/components/ui/contact";

const Main = () => {
    return (
        <main className="grid grid-cols-12 w-screen h-fit">
            <section id="home" className="col-span-12">
                <Home />
            </section>

            <section id="about" className="col-span-12">
                <About />
            </section>

            <section id="services" className="col-span-12">
                <Services />
            </section>

            <section id="gallery" className="col-span-12">
                <Gallery />
            </section>

            <section id="pricing" className="col-span-12">
                <Pricing />
            </section>

            <section id="blog" className="col-span-12">
                <Blog />
            </section>

            <section id="contact" className="col-span-12">
                <Contact />
            </section>
        </main>
    );
};

export default Main;