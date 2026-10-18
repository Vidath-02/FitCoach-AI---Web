import { AnimatePresence, motion } from "framer-motion";
import { Checkbox, Question, TextArea, TextField, Toggle } from "../controls";
import type { StepProps } from "../types";
import { isEmail } from "../validation";

export function FinalStep({ answers, update, showErrors }: StepProps & { showErrors: boolean }) {
  const emailInvalid = showErrors && answers.earlyAccess && !isEmail(answers.email);

  return (
    <div className="space-y-10">
      <Question title="What's one feature that would make you use FitCoach AI every week?" optional>
        <TextArea
          label="Feature wishlist"
          value={answers.wishlist}
          onChange={(v) => update("wishlist", v)}
          placeholder="e.g. A weekly body report that shows exactly where I've changed…"
        />
      </Question>

      <Question title="Anything else I should know?" hint="Concerns, ideas and frustrations with other apps are all welcome." optional>
        <TextArea
          label="Additional feedback"
          value={answers.feedback}
          onChange={(v) => update("feedback", v)}
          placeholder="Share anything…"
          rows={3}
        />
      </Question>

      <Question title="Stay in the loop">
        <div className="space-y-3">
          <Toggle
            checked={answers.earlyAccess}
            onChange={(v) => update("earlyAccess", v)}
            label="Get early access to Phase 1"
            description="You'll get one email when the January release is ready. No spam."
          />
          <AnimatePresence initial={false}>
            {answers.earlyAccess && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-1">
                  <TextField
                    type="email"
                    label="Email address"
                    value={answers.email}
                    onChange={(v) => update("email", v)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    invalid={emailInvalid}
                  />
                  {emailInvalid && <p className="mt-2 pl-1 text-xs text-danger">Please enter a valid email, or turn off early access.</p>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Question>

      {/* honeypot: hidden from people and assistive tech, bots tend to fill it */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        value={answers.company}
        onChange={(e) => update("company", e.target.value)}
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <Checkbox checked={answers.consent} onChange={(v) => update("consent", v)} invalid={showErrors && !answers.consent}>
        I agree that my responses may be used, in anonymised form, for the FitCoach AI final-year university research
        project. My email (if provided) is only used to send launch updates.
      </Checkbox>
    </div>
  );
}
