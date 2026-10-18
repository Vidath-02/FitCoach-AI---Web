import { Chips, FollowUp, OptionCards, Question, RangeSlider } from "../controls";
import { appDropReasons, appsUsed, challenges, measurementMethods, trackingMethods, yesNo } from "../options";
import type { StepProps } from "../types";

const satisfactionLabel = (v: number) =>
  v <= 2 ? "Frustrated" : v <= 4 ? "Not great" : v <= 6 ? "It's okay" : v <= 8 ? "Pretty good" : "Love it";

export function TrackingStep({ answers, update }: StepProps) {
  return (
    <div className="space-y-10">
      <Question title="Do you currently use a fitness app?">
        <OptionCards
          label="Uses a fitness app"
          options={yesNo}
          value={answers.usesFitnessApp}
          onChange={(v) => update("usesFitnessApp", v as "yes" | "no" | "")}
        />
      </Question>

      <FollowUp show={answers.usesFitnessApp === "yes"}>
        <Question title="Which apps or devices do you use?" hint="Select all that apply." optional>
          <Chips label="Apps used" options={appsUsed} value={answers.appsUsed} onChange={(v) => update("appsUsed", v)} />
        </Question>
      </FollowUp>

      <FollowUp show={answers.usesFitnessApp === "no"}>
        <Question title="What's kept you from using one?" hint="Select all that apply." optional>
          <Chips
            label="Reasons for not using a fitness app"
            options={appDropReasons}
            value={answers.appDropReasons}
            onChange={(v) => update("appDropReasons", v)}
          />
        </Question>
      </FollowUp>

      <Question title="How do you track your progress today?" hint="Select all that apply.">
        <Chips
          label="Tracking methods"
          options={trackingMethods}
          value={answers.trackingMethods}
          onChange={(v) => update("trackingMethods", v)}
          exclusive="none"
        />
      </Question>

      <Question title="How do you measure your body?" hint="Select all that apply.">
        <Chips
          label="Measurement methods"
          options={measurementMethods}
          value={answers.measurementMethods}
          onChange={(v) => update("measurementMethods", v)}
          exclusive="never"
        />
      </Question>

      <Question title="How satisfied are you with the way you track progress?">
        <RangeSlider
          label="Tracking satisfaction from 1 to 10"
          value={answers.trackingSatisfaction}
          onChange={(v) => update("trackingSatisfaction", v)}
          min={1}
          max={10}
          ticks={["1 · Frustrated", "10 · Love it"]}
          format={(v) => (
            <>
              {v}
              <span className="ml-1.5 text-base font-medium text-muted">/ 10 · {satisfactionLabel(v)}</span>
            </>
          )}
        />
      </Question>

      <Question title="What's your biggest fitness challenge?" optional>
        <OptionCards
          label="Biggest challenge"
          options={challenges}
          value={answers.biggestChallenge}
          onChange={(v) => update("biggestChallenge", v as string)}
          size="sm"
        />
      </Question>
    </div>
  );
}
