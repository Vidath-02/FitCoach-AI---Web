import { Chips, EmojiScale, OptionCards, Question } from "../controls";
import { checkInFrequencies, coachStyles, dietPreferences, motivators, trustScale } from "../options";
import type { StepProps } from "../types";

export function CoachStep({ answers, update }: StepProps) {
  return (
    <div className="space-y-10">
      <Question title="How should your AI coach talk to you?">
        <OptionCards
          label="Coaching style"
          options={coachStyles}
          value={answers.coachStyle}
          onChange={(v) => update("coachStyle", v as string)}
          size="sm"
        />
      </Question>

      <Question title="How often would you like it to check in?" optional>
        <OptionCards
          label="Check-in frequency"
          options={checkInFrequencies}
          value={answers.checkInFrequency}
          onChange={(v) => update("checkInFrequency", v as string)}
          columns={4}
          size="sm"
        />
      </Question>

      <Question title="How much would you trust workout and meal advice from an AI?">
        <EmojiScale label="Trust in AI advice" options={trustScale} value={answers.aiTrust} onChange={(v) => update("aiTrust", v)} />
      </Question>

      <Question title="What keeps you motivated?" hint="Select all that apply." optional>
        <Chips label="Motivators" options={motivators} value={answers.motivators} onChange={(v) => update("motivators", v)} />
      </Question>

      <Question title="Any dietary preferences for meal guidance?" hint="Select all that apply." optional>
        <Chips
          label="Dietary preferences"
          options={dietPreferences}
          value={answers.dietPreference}
          onChange={(v) => update("dietPreference", v)}
          exclusive="none"
        />
      </Question>
    </div>
  );
}
