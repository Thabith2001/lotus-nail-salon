import React from 'react';
import Home from "@/components/ui/home";
import About from "@/components/ui/about";
import Pricing from "@/components/ui/pricing";
import Blog from "@/components/ui/blog";
import Gallery from "@/components/ui/gallery";


const Main = () => {
    return (
        <main className="grid grid-cols-12 w-screen h-fit">
            <section id="home" className="col-span-12">
                <Home/>
            </section>

            <section id="about" className="col-span-12">
                <About/>
            </section>

            <section id="gallery" className="col-span-12">
                <Gallery/>
            </section>

            <section id="services" className="col-span-12">
                <Pricing/>
            </section>


            <section id="blogs" className="col-span-12">
                <Blog/>
            </section>

        </main>
    );
};

export default Main;