import { OptionCards, Question, TextField } from "../controls";
import { ageRanges, genders, occupations, regions } from "../options";
import type { StepProps } from "../types";

export function AboutYouStep({ answers, update, showErrors }: StepProps) {
  return (
    <div className="space-y-10">
      <Question title="What should I call you?" hint="First name or nickname. It just personalises your experience." optional>
        <TextField
          label="Your name"
          value={answers.name}
          onChange={(v) => update("name", v)}
          placeholder="e.g. Alex"
          autoComplete="given-name"
        />
      </Question>

      <Question title="How old are you?" invalid={showErrors && !answers.ageRange}>
        <OptionCards
          label="Age range"
          options={ageRanges}
          value={answers.ageRange}
          onChange={(v) => update("ageRange", v as string)}
          columns={3}
          size="sm"
        />
      </Question>

      <Question title="Gender" hint="Body measurement models can differ by body type, so this helps me test fairly." invalid={showErrors && !answers.gender}>
        <OptionCards
          label="Gender"
          options={genders}
          value={answers.gender}
          onChange={(v) => update("gender", v as string)}
          columns={4}
          size="sm"
        />
      </Question>

      <Question title="Where are you based?" invalid={showErrors && !answers.region}>
        <OptionCards
          label="Region"
          options={regions}
          value={answers.region}
          onChange={(v) => update("region", v as string)}
          columns={3}
          size="sm"
        />
      </Question>

      <Question title="What best describes you?" invalid={showErrors && !answers.occupation}>
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
