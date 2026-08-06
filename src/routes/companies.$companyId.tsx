import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BadgeCheck, Globe, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/job-card";
import { fetchCompanyProfile } from "@/lib/jobs.functions";

export const Route = createFileRoute("/companies/$companyId")({
  loader: async ({ params }) => {
    const profile = await fetchCompanyProfile({ data: { id: params.companyId } });
    if (!profile) throw notFound();
    return profile;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Company unavailable | EthioJobs Connect" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${loaderData.company.name} — Jobs & Company Profile | EthioJobs Connect`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.company.about },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.company.about },
      ],
    };
  },
  component: CompanyDetail,
  errorComponent: ({ error }) => (
    <div role="alert" className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="font-display text-2xl font-semibold">Couldn’t load this company</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="font-display text-2xl font-semibold">Company not found</h1>
      <Button asChild className="mt-6">
        <Link to="/companies">Back to companies</Link>
      </Button>
    </div>
  ),
});

function CompanyDetail() {
  const { company, openJobs } = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link to="/companies" className="text-sm text-muted-foreground hover:text-foreground">
        ← All companies
      </Link>

      <div className="mt-4 rounded-xl border border-border bg-card p-6 shadow-soft">
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex size-16 items-center justify-center rounded-xl bg-secondary font-display text-lg font-semibold text-secondary-foreground">
            {company.initials}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="flex items-center gap-2 font-display text-2xl font-semibold">
              {company.name}
              {company.verified ? <BadgeCheck className="size-5 text-accent" /> : null}
            </h1>
            <p className="text-sm text-muted-foreground">{company.industry}</p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4" /> {company.city}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-4" /> {company.employees} employees
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Globe className="size-4" /> {company.website}
              </span>
            </div>
          </div>
        </div>
        <p className="mt-5 text-sm text-muted-foreground">{company.about}</p>
      </div>

      <h2 className="mt-10 font-display text-xl font-semibold">Open roles ({openJobs.length})</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {openJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
      {openJobs.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No open roles at the moment.</p>
      ) : null}
    </div>
  );
}
