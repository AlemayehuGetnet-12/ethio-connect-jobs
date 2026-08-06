import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About EthioJobs Connect | Our Mission" },
      {
        name: "description",
        content:
          "EthioJobs Connect is a modern job marketplace built to connect Ethiopian job seekers with verified employers hiring nationwide.",
      },
      { property: "og:title", content: "About EthioJobs Connect | Our Mission" },
      {
        property: "og:description",
        content: "Why we built a modern job marketplace for Ethiopian talent and employers.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-display text-3xl font-semibold">About EthioJobs Connect</h1>
      <p className="mt-4 text-muted-foreground">
        Hiring in Ethiopia still runs on newspaper columns, Telegram forwards and word of mouth.
        Talented graduates in Bahir Dar never hear about the role in Addis Ababa they would have
        been perfect for, and employers repeat the same slow search every quarter.
      </p>
      <p className="mt-4 text-muted-foreground">
        EthioJobs Connect brings that market into one place: verified employers, structured job
        posts with real salary ranges, and search that works on a phone with a weak connection.
      </p>

      <h2 className="mt-10 font-display text-xl font-semibold">What we are building</h2>
      <ul className="mt-4 space-y-3 text-muted-foreground">
        <li className="rounded-lg border border-border bg-card p-4">
          <span className="font-medium text-foreground">For job seekers.</span> A professional
          profile, saved jobs, one-click applications and status tracking from applied to hired.
        </li>
        <li className="rounded-lg border border-border bg-card p-4">
          <span className="font-medium text-foreground">For employers.</span> Company profiles,
          job posting and applicant management with shortlisting and interview scheduling.
        </li>
        <li className="rounded-lg border border-border bg-card p-4">
          <span className="font-medium text-foreground">For the platform.</span> Employer
          verification, moderation and analytics so listings stay trustworthy.
        </li>
      </ul>

      <p className="mt-8 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
        This is the first release: public browsing and search. Accounts, applications and the
        employer and admin dashboards come next.
      </p>
    </div>
  );
}
