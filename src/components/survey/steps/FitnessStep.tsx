import { Chips, OptionCards, Question, RangeSlider } from "../controls";
import { activityLevels, coachOptions, goals, trainingExperience, trainingPlaces } from "../options";
import type { StepProps } from "../types";

export function FitnessStep({ answers, update }: StepProps) {
  return (
    <div className="space-y-10">
      <Question title="How active are you right now?">
        <OptionCards
          label="Activity level"
          options={activityLevels}
          value={answers.activityLevel}
          onChange={(v) => update("activityLevel", v as string)}
        />
      </Question>

      <Question title="How long have you been working out?" optional>
        <OptionCards
          label="Training experience"
          options={trainingExperience}
          value={answers.trainingExperience}
          onChange={(v) => update("trainingExperience", v as string)}
          columns={3}
          size="sm"
        />
      </Question>

      <Question title="How long is a typical workout?" hint="Drag the slider. A rough guess is perfect.">
        <RangeSlider
          label="Typical workout length in minutes"
          value={answers.sessionMinutes}
          onChange={(v) => update("sessionMinutes", v)}
          min={0}
          max={120}
          step={5}
          ticks={["0", "60 min", "120+"]}
          format={(v) => (
            <>
              {v === 0 ? "Not yet" : v >= 120 ? "120+" : v}
              {v > 0 && <span className="ml-1.5 text-base font-medium text-muted">min</span>}
            </>
          )}
        />
      </Question>

      <Question title="What are your main goals?" hint="Pick as many as you like.">
        <OptionCards
          label="Fitness goals"
          options={goals}
          value={answers.goals}
          onChange={(v) => update("goals", v as string[])}
          multiple
          size="sm"
        />
      </Question>

      <Question title="Where do you usually train?" optional>
        <Chips
          label="Training places"
          options={trainingPlaces}
          value={answers.trainingPlaces}
          onChange={(v) => update("trainingPlaces", v)}
        />
      </Question>

      <Question title="Do you work with a personal trainer or coach?" optional>
        <OptionCards
          label="Personal trainer or coach"
          options={coachOptions}
          value={answers.hasCoach}
          onChange={(v) => update("hasCoach", v as string)}
          columns={4}
          size="sm"
        />
      </Question>
    </div>
  );
}
