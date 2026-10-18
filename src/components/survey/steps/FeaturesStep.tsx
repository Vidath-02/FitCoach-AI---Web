import { Chips, FeatureRating, OptionCards, Question } from "../controls";
import { features, platforms, pricing } from "../options";
import type { StepProps } from "../types";

export function FeaturesStep({ answers, update }: StepProps) {
  const mustCount = Object.values(answers.featureInterest).filter((v) => v === 2).length;

  return (
    <div className="space-y-10">
      <Question
        title="Which features matter to you?"
        hint={`Rate each one — we'll prioritise the must-haves.${mustCount ? ` (${mustCount} must-have${mustCount > 1 ? "s" : ""} so far)` : ""}`}
      >
        <div className="grid gap-3">
          {features.map((f) => (
            <FeatureRating
              key={f.value}
              option={f}
              value={answers.featureInterest[f.value]}
              onChange={(v) => update("featureInterest", { ...answers.featureInterest, [f.value]: v })}
            />
          ))}
        </div>
      </Question>

      <Question title="Where would you use FitCoach AI?" hint="Select all that apply.">
        <Chips label="Platforms" options={platforms} value={answers.platforms} onChange={(v) => update("platforms", v)} />
      </Question>

      <Question title="Which pricing model feels fair?">
        <OptionCards
          label="Pricing preference"
          options={pricing}
          value={answers.pricing}
          onChange={(v) => update("pricing", v as string)}
          size="sm"
        />
      </Question>
    </div>
  );
}
