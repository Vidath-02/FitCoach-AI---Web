import { Camera, Lock } from "lucide-react";
import { EmojiScale, OptionCards, Question, RangeSlider } from "../controls";
import { comfortScale, scanFrequencies } from "../options";
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
          phone, and our model estimates measurements like chest, waist and hips — no tape measure needed.
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

      <Question title="How important is privacy of your body data?">
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

      <Question title="How often would you scan to track progress?">
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
