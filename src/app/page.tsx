import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Portfolio from "@/components/Portfolio";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <div aria-hidden className="my-16 space-y-3 md:my-24">
          <div className="h-px w-full bg-lilac-300/70" />
          <div className="h-px w-full bg-lilac-300/70" />
        </div>
        <Portfolio />
      </main>
      <Footer />
    </>
  );
}
