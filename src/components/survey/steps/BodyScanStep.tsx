import { Camera, Lock } from "lucide-react";
import { Chips, EmojiScale, OptionCards, Question, RangeSlider } from "../controls";
import { accuracyNeeds, comfortScale, photoStorage, scanClothing, scanFrequencies, scanMeasurements } from "../options";
import type { StepProps } from "../types";

const privacyLabel = (v: number) =>
  v < 25 ? "Not a concern" : v < 50 ? "Somewhat important" : v < 75 ? "Very important" : "Absolutely critical";

export function BodyScanStep({ answers, update }: StepProps) {
  return (
    <div className="space-y-10">
      <div className="flex gap-4 rounded-2xl border border-cyan/20 bg-cyan/[0.04] p-5">
        <Camera className="mt-0.5 h-5 w-5 shrink-0 text-cyan" />
        <p className="text-sm leading-relaxed text-fg/85">
          <span className="font-medium text-fg">How it would work:</span> you take a front and a side photo with your
          phone, and the model estimates measurements like chest, waist and hips. No tape measure needed.
        </p>
      </div>

      <Question title="How comfortable would you be scanning your body with your phone camera?">
        <EmojiScale
          label="Camera scan comfort"
          options={comfortScale}
          value={answers.cameraComfort}
          onChange={(v) => update("cameraComfort", v)}
        />
      </Question>

      <Question title="Which measurements would you want FitCoach AI to estimate?" hint="Select all that apply.">
        <Chips
          label="Measurements wanted"
          options={scanMeasurements}
          value={answers.scanMeasurements}
          onChange={(v) => update("scanMeasurements", v)}
        />
      </Question>

      <Question title="How accurate would the estimates need to be for you to trust them?">
        <OptionCards
          label="Accuracy needed"
          options={accuracyNeeds}
          value={answers.accuracyNeed}
          onChange={(v) => update("accuracyNeed", v as string)}
          size="sm"
        />
      </Question>

      <Question title="What would you be comfortable wearing for a scan?" optional>
        <OptionCards
          label="Clothing for a scan"
          options={scanClothing}
          value={answers.scanClothing}
          onChange={(v) => update("scanClothing", v as string)}
          size="sm"
        />
      </Question>

      <Question title="What should happen to your scan photos?">
        <OptionCards
          label="Photo storage preference"
          options={photoStorage}
          value={answers.photoStorage}
          onChange={(v) => update("photoStorage", v as string)}
          size="sm"
        />
      </Question>

      <Question title="How important is the privacy of your body data?">
        <RangeSlider
          label="Privacy importance from 0 to 100"
          value={answers.privacyImportance}
          onChange={(v) => update("privacyImportance", v)}
          min={0}
          max={100}
          step={5}
          ticks={["Not a concern", "Critical"]}
          format={(v) => (
            <span className="inline-flex items-center gap-2.5">
              <Lock className="h-6 w-6 text-volt" />
              {privacyLabel(v)}
            </span>
          )}
        />
      </Question>

      <Question title="How often would you scan to track progress?" optional>
        <OptionCards
          label="Scan frequency"
          options={scanFrequencies}
          value={answers.scanFrequency}
          onChange={(v) => update("scanFrequency", v as string)}
          columns={4}
          size="sm"
        />
      </Question>
    </div>
  );
}
