import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { Logo } from "@/components/ui/Logo";
import { creator, site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Privacy notice | ${site.name}`,
  description: "What the FitCoach AI survey collects, why, where it's stored and your choices.",
};

const LAST_UPDATED = "October 2026";

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "What the survey collects",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Your answers: multiple-choice selections, ratings and any optional text you write.</li>
        <li>An optional first name or nickname, used only to personalise the thank-you message.</li>
        <li>Your email address, only if you turn on early access or beta testing.</li>
        <li>Basic context sent with your answers: time zone, browser language and how long the survey took.</li>
      </ul>
    ),
  },
  {
    title: "What it doesn't collect",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>No photos or body scans. The survey only asks about them.</li>
        <li>No cookies, analytics or advertising trackers.</li>
        <li>
          No stored IP addresses. Your IP is used briefly in memory to stop repeated automated submissions, then
          discarded.
        </li>
      </ul>
    ),
  },
  {
    title: "Why it's collected",
    body: (
      <p>
        Responses are used for the FitCoach AI final-year university research project: to understand people&apos;s
        fitness habits and expectations, and to decide what gets built. Results are reported only in aggregated,
        anonymised form. Emails are used only to send the launch update and, if you opted in, beta testing invitations.
      </p>
    ),
  },
  {
    title: "Where it's stored and who can see it",
    body: (
      <p>
        Responses are stored in a secured Supabase database. Only the website&apos;s server can add responses, and only{" "}
        {creator.name} can read them. Contact details are kept separate from the data used for analysis. Your data is
        never sold or shared with third parties.
      </p>
    ),
  },
  {
    title: "How long it's kept",
    body: (
      <p>
        Survey responses are kept for the duration of the research project. Email addresses are deleted once launch
        updates and beta testing have finished.
      </p>
    ),
  },
  {
    title: "Your choices",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          Personal questions include a &ldquo;Prefer not to say&rdquo; option, your name is optional, and you can stop at
          any time. Nothing is sent until you press submit.
        </li>
        <li>
          Unfinished answers are saved only in your own browser so you can resume, and they&apos;re cleared when you
          submit.
        </li>
        <li>
          To have your response or email removed, get in touch using the link below. If you left an email, it can be
          used to find your response; fully anonymous responses can&apos;t be traced back to you.
        </li>
      </ul>
    ),
  },
];

export default function PrivacyPage() {
  const contact = creator.links.find((l) => l.label === "LinkedIn");

  return (
    <>
      <AmbientBackground />
      <main className="relative mx-auto max-w-3xl px-6 pb-24 pt-10 sm:pt-14">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="Back to FitCoach AI" className="rounded-full">
            <Logo />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-line-strong hover:text-fg"
          >
            <ArrowLeft className="h-4 w-4" /> Back to site
          </Link>
        </div>

        <p className="mt-16 font-mono text-[11px] uppercase tracking-[0.2em] text-volt">Privacy notice</p>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl">
          Your data, handled with care.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          A plain-language summary of what the {site.name} survey collects and how it&apos;s protected.
        </p>
        <p className="mt-3 font-mono text-xs text-subtle">Last updated: {LAST_UPDATED}</p>

        <div className="mt-12 space-y-5">
          {sections.map((s) => (
            <section key={s.title} className="rounded-3xl border border-line bg-surface/85 p-6 pointer-fine:bg-surface/60 pointer-fine:backdrop-blur-xl sm:p-8">
              <h2 className="font-display text-xl font-semibold tracking-tight">{s.title}</h2>
              <div className="mt-3 leading-relaxed text-muted">{s.body}</div>
            </section>
          ))}

          <section className="rounded-3xl border border-volt/30 bg-volt/[0.04] p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold tracking-tight">Questions or removal requests</h2>
            <p className="mt-3 leading-relaxed text-muted">
              {site.name} is an individual final-year project by {creator.name}. For any privacy question or to remove
              your data, send a message:
            </p>
            {contact && (
              <a
                href={contact.href}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-line bg-white/[0.03] px-4 py-2 text-sm text-fg transition-colors hover:border-volt/50 hover:text-volt"
              >
                Contact {creator.name.split(" ")[0]} on LinkedIn <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
