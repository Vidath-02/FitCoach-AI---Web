import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { Hero } from "@/components/sections/Hero";
import { KeywordMarquee } from "@/components/sections/KeywordMarquee";
import { About } from "@/components/sections/About";
import { VisionMission } from "@/components/sections/VisionMission";
import { Roadmap } from "@/components/sections/Roadmap";
import { SurveySection } from "@/components/sections/SurveySection";

export default function Home() {
  return (
    <>
      <AmbientBackground />
      <ScrollProgress />
      <Navbar />
      <main className="relative">
        <Hero />
        <KeywordMarquee />
        <About />
        <VisionMission />
        <Roadmap />
        <SurveySection />
      </main>
      <Footer />
    </>
  );
}
