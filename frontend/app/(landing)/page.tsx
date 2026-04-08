import Footer from "./Footer";
import Features from "./Features";
import Hero from "./Hero";
import Navbar from "./Navbar";

export default function LandingPage() {
    return (
        <>
            <Navbar />
            <main>
                <Hero />
                <Features />
            </main>
            <Footer />
        </>
    );
}
