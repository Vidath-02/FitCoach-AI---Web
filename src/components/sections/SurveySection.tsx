import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { LazySurvey } from "@/components/survey/LazySurvey";

export function SurveySection() {
  return (
    <section id="survey" className="relative py-28 sm:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-40 h-[600px] w-[900px] max-w-full -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(200,255,61,0.10),transparent)]"
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          align="center"
          eyebrow="04 / Community survey"
          title="Help build the coach you actually want."
          highlight={["actually", "want"]}
          description="This isn't just a form. It's your seat at the design table. I read every answer personally, and together they shape the Phase 1 release."
        />
        <Reveal className="mt-16" y={40}>
          <LazySurvey />
        </Reveal>
      </div>
    </section>
  );
}
