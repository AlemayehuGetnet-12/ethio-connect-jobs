import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BadgeCheck, MapPin, Users } from "lucide-react";
import { companiesQuery } from "@/lib/jobs-queries";

export const Route = createFileRoute("/companies/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(companiesQuery());
  },
  head: () => ({
    meta: [
      { title: "Ethiopian Employers Hiring Now | EthioJobs Connect" },
      {
        name: "description",
        content:
          "Explore verified Ethiopian companies hiring across technology, banking, healthcare, logistics and education.",
      },
      { property: "og:title", content: "Ethiopian Employers Hiring Now | EthioJobs Connect" },
      {
        property: "og:description",
        content: "Explore verified Ethiopian companies and their open roles.",
      },
    ],
  }),
  component: CompaniesPage,
  errorComponent: ({ error }) => (
    <div role="alert" className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="font-display text-2xl font-semibold">Couldn’t load companies</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <p className="text-sm text-muted-foreground">No companies yet.</p>
    </div>
  ),
});

function CompaniesPage() {
  const { data: companies } = useSuspenseQuery(companiesQuery());

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">Companies</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Employers actively hiring on EthioJobs Connect.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <Link
            key={company.id}
            to="/companies/$companyId"
            params={{ companyId: company.id }}
            className="rounded-xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-lift"
          >
            <span className="flex size-12 items-center justify-center rounded-lg bg-secondary font-display text-sm font-semibold text-secondary-foreground">
              {company.initials}
            </span>
            <p className="mt-3 flex items-center gap-1.5 font-display text-base font-semibold">
              {company.name}
              {company.verified ? <BadgeCheck className="size-4 text-accent" /> : null}
            </p>
            <p className="text-sm text-muted-foreground">{company.industry}</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3.5" /> {company.city}
              </span>
              <span className="inline-flex items-center gap-1">
                <Users className="size-3.5" /> {company.employees}
              </span>
            </div>
            <p className="mt-3 text-xs font-medium text-accent">
              {company.openJobs} open {company.openJobs === 1 ? "role" : "roles"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
