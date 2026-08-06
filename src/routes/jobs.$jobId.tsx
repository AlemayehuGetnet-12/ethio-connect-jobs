import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  MapPin,
  Wallet,
  CalendarClock,
  GraduationCap,
  Briefcase,
  BadgeCheck,
  Users,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatSalary, getCompany, getJob } from "@/data/jobs";

export const Route = createFileRoute("/jobs/$jobId")({
  loader: ({ params }) => {
    const job = getJob(params.jobId);
    if (!job) throw notFound();
    return { job, company: getCompany(job.companyId) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Job unavailable | EthioJobs Connect" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.job.title} at ${loaderData.company?.name} | EthioJobs Connect`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.job.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.job.summary },
      ],
    };
  },
  component: JobDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="font-display text-2xl font-semibold">This job is no longer listed</h1>
      <p className="mt-2 text-sm text-muted-foreground">It may have been closed or removed.</p>
      <Button asChild className="mt-6">
        <Link to="/jobs">Browse open jobs</Link>
      </Button>
    </div>
  ),
});

function JobDetail() {
  const { job, company } = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link to="/jobs" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to all jobs
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-start gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-secondary font-display text-base font-semibold text-secondary-foreground">
                {company?.initials}
              </span>
              <div>
                <h1 className="font-display text-2xl font-semibold">{job.title}</h1>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  {company ? (
                    <Link to="/companies/$companyId" params={{ companyId: company.id }} className="hover:text-foreground">
                      {company.name}
                    </Link>
                  ) : null}
                  {company?.verified ? <BadgeCheck className="size-4 text-accent" /> : null}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Meta icon={<MapPin className="size-4" />} label="Location" value={`${job.city}${job.remote ? " · Remote friendly" : ""}`} />
              <Meta icon={<Wallet className="size-4" />} label="Salary" value={formatSalary(job.salaryMin, job.salaryMax)} />
              <Meta icon={<Briefcase className="size-4" />} label="Employment" value={`${job.employmentType} · ${job.experience}`} />
              <Meta icon={<GraduationCap className="size-4" />} label="Education" value={job.education} />
              <Meta icon={<CalendarClock className="size-4" />} label="Deadline" value={job.deadline} />
              <Meta icon={<Users className="size-4" />} label="Applicants" value={`${job.applicants} so far`} />
            </div>
          </div>

          <Section title="About the role">
            <p>{job.description}</p>
          </Section>

          <Section title="Requirements">
            <ul className="list-disc space-y-1.5 pl-5">
              {job.requirements.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </Section>

          <Section title="Benefits">
            <ul className="list-disc space-y-1.5 pl-5">
              {job.benefits.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </Section>

          <Section title="Skills">
            <div className="flex flex-wrap gap-2">
              {job.skills.map((s) => (
                <Badge key={s} variant="secondary">
                  {s}
                </Badge>
              ))}
            </div>
          </Section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <p className="font-display text-sm font-semibold">Interested in this role?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Accounts are coming next — applications open once sign-in is live.
            </p>
            <Button className="mt-4 w-full" disabled>
              Apply now
            </Button>
            <Button variant="outline" className="mt-2 w-full" disabled>
              <Bookmark className="size-4" /> Save job
            </Button>
          </div>

          {company ? (
            <div className="mt-4 rounded-xl border border-border bg-card p-5 shadow-soft">
              <p className="font-display text-sm font-semibold">{company.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {company.industry} · {company.city} · {company.employees} employees
              </p>
              <p className="mt-3 text-sm text-muted-foreground">{company.about}</p>
              <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                <Link to="/companies/$companyId" params={{ companyId: company.id }}>
                  View company
                </Link>
              </Button>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function Meta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg bg-muted/60 p-3">
      <span className="mt-0.5 text-accent">{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 rounded-xl border border-border bg-card p-6 shadow-soft">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <div className="mt-3 text-sm text-muted-foreground">{children}</div>
    </section>
  );
}
