// =============================================================================
// Home page — the single-page site. Sections are modular: add/remove freely.
//   Header → Hero → Alumni showcase (carousel) → Register (auth-gated) → Footer
// =============================================================================
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AlumniCarousel from "@/components/AlumniCarousel";
import RegisterSection from "@/components/RegisterSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      {/* Placeholder alumni slideshow — edit ALUMNI_PROFILES in src/config/event.ts */}
      <AlumniCarousel />
      <RegisterSection />
      <Footer />
    </main>
  );
}
