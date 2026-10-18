import { OptionCards, Question, TextField } from "../controls";
import { ageRanges, genders, occupations } from "../options";
import type { StepProps } from "../types";

export function AboutYouStep({ answers, update }: StepProps) {
  return (
    <div className="space-y-10">
      <Question title="What should we call you?" hint="First name or nickname — it just personalises your experience." optional>
        <TextField
          label="Your name"
          value={answers.name}
          onChange={(v) => update("name", v)}
          placeholder="e.g. Alex"
          autoComplete="given-name"
        />
      </Question>

      <Question title="How old are you?">
        <OptionCards
          label="Age range"
          options={ageRanges}
          value={answers.ageRange}
          onChange={(v) => update("ageRange", v as string)}
          columns={3}
          size="sm"
        />
      </Question>

      <Question title="Gender" hint="Body measurement models can differ by body type — this helps us test fairly." optional>
        <OptionCards
          label="Gender"
          options={genders}
          value={answers.gender}
          onChange={(v) => update("gender", v as string)}
          columns={4}
          size="sm"
        />
      </Question>

      <Question title="What best describes you?" optional>
        <OptionCards
          label="Occupation"
          options={occupations}
          value={answers.occupation}
          onChange={(v) => update("occupation", v as string)}
          columns={2}
          size="sm"
        />
      </Question>
    </div>
  );
}
