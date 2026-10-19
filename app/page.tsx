import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Menu from "@/components/Menu";
import Reservation from "@/components/Reservation";
import Location from "@/components/Location";
import Footer from "@/components/Footer";
import CartBar from "@/components/CartBar";

export default function Home() {
  return (
    <main>
      <Preloader />
      <CustomCursor />
      <Navbar />
      <Hero />
      <Marquee />
      <About />
      <Menu />
      <Reservation />
      <Location />
      <Footer />
      <CartBar />
    </main>
  );
}
