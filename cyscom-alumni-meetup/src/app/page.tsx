// =============================================================================
// Home page — the single-page site. Sections are modular: add/remove freely.
//   Header → Hero → Schedule (placeholder) → Register (auth-gated) → Footer
// =============================================================================
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Schedule from "@/components/Schedule";
import RegisterSection from "@/components/RegisterSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      {/* TODO: replace placeholder schedule with real alumni details & program */}
      <Schedule />
      <RegisterSection />
      <Footer />
    </main>
  );
}
