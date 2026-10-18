import { Checkbox, FollowUp, NumberScale, Question, TextArea, TextField, Toggle } from "../controls";
import type { StepProps } from "../types";
import { isEmail } from "../validation";

export function FinalStep({ answers, update, showErrors }: StepProps & { showErrors: boolean }) {
  const needsEmail = answers.earlyAccess || answers.betaTester;
  const emailInvalid = showErrors && needsEmail && !isEmail(answers.email);

  return (
    <div className="space-y-10">
      <Question title="How likely are you to try FitCoach AI when it launches?">
        <NumberScale
          label="Likelihood to try FitCoach AI, 0 to 10"
          value={answers.launchLikelihood}
          onChange={(v) => update("launchLikelihood", v)}
          lowLabel="0 · Not at all"
          highLabel="10 · Definitely"
        />
      </Question>

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
          <Toggle
            checked={answers.betaTester}
            onChange={(v) => update("betaTester", v)}
            label="Help test the beta"
            description="Try early builds and share quick feedback. Around 20 minutes of your time."
          />
          <FollowUp show={needsEmail}>
            <TextField
              type="email"
              label="Email address"
              value={answers.email}
              onChange={(v) => update("email", v)}
              placeholder="you@example.com"
              autoComplete="email"
              invalid={emailInvalid}
            />
            {emailInvalid && (
              <p className="mt-2 pl-1 text-xs text-danger">Please enter a valid email, or turn off the options above.</p>
            )}
          </FollowUp>
        </div>
      </Question>

      {/* Honeypot for simple bots. Fully hidden (display: none) so browser autofill and
          password managers skip it; if it's ever filled, the response is still saved, just flagged. */}
      <div hidden aria-hidden>
        <input
          type="text"
          name="fc_extra_field"
          tabIndex={-1}
          autoComplete="off"
          data-1p-ignore
          data-lpignore="true"
          data-bwignore
          data-form-type="other"
          value={answers.company}
          onChange={(e) => update("company", e.target.value)}
        />
      </div>

      <Checkbox checked={answers.consent} onChange={(v) => update("consent", v)} invalid={showErrors && !answers.consent}>
        I agree that my responses may be used, in anonymised form, for the FitCoach AI final-year university research
        project. My email (if provided) is only used for launch updates and, if I opted in, beta testing invitations.
      </Checkbox>
    </div>
  );
}
