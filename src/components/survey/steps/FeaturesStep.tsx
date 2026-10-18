import { Chips, FeatureRating, OptionCards, Question } from "../controls";
import { dailyTimes, features, platforms, pricing } from "../options";
import type { StepProps } from "../types";

export function FeaturesStep({ answers, update, showErrors }: StepProps) {
  const mustCount = Object.values(answers.featureInterest).filter((v) => v === 2).length;
  const rated = features.filter((f) => answers.featureInterest[f.value] !== undefined).length;

  return (
    <div className="space-y-10">
      <Question
        title="Which features matter to you?"
        hint={`Rate each one. Must-haves get built first. ${rated} of ${features.length} rated${mustCount ? `, ${mustCount} must-have${mustCount > 1 ? "s" : ""}` : ""}.`}
        invalid={showErrors && rated < features.length}
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

      <Question title="Where would you use FitCoach AI?" hint="Select all that apply." invalid={showErrors && answers.platforms.length === 0}>
        <Chips label="Platforms" options={platforms} value={answers.platforms} onChange={(v) => update("platforms", v)} />
      </Question>

      <Question title="How much time would you spend in the app each day?" invalid={showErrors && !answers.dailyTime}>
        <OptionCards
          label="Daily time in the app"
          options={dailyTimes}
          value={answers.dailyTime}
          onChange={(v) => update("dailyTime", v as string)}
          columns={4}
          size="sm"
        />
      </Question>

      <Question title="Which pricing model feels fair?" invalid={showErrors && !answers.pricing}>
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
