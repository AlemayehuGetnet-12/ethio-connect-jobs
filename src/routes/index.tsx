import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, MapPin, BadgeCheck, ArrowRight, Users, Building2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JobCard } from "@/components/job-card";
import { categories, companies, jobs } from "@/data/jobs";
import heroImage from "@/assets/hero-professionals.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EthioJobs Connect — Jobs in Ethiopia, Updated Daily" },
      {
        name: "description",
        content:
          "Find verified jobs across Addis Ababa, Bahir Dar, Adama and Hawassa. Browse openings by category, city and salary on EthioJobs Connect.",
      },
      { property: "og:title", content: "EthioJobs Connect — Jobs in Ethiopia, Updated Daily" },
      {
        property: "og:description",
        content: "Browse verified Ethiopian job openings by category, city and salary.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const latest = [...jobs].sort((a, b) => a.postedDaysAgo - b.postedDaysAgo).slice(0, 6);

  return (
    <div>
      <section className="surface-hero relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-gold/20 px-3 py-1 text-xs font-medium text-gold">
              <BadgeCheck className="size-3.5" /> Verified Ethiopian employers
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-tight text-primary-foreground md:text-5xl">
              Your next role in Ethiopia starts here
            </h1>
            <p className="mt-4 max-w-md text-base text-primary-foreground/80">
              Search openings from banks, tech companies, hospitals and manufacturers hiring across
              the country.
            </p>

            <form
              className="mt-7 flex flex-col gap-2 rounded-xl bg-card p-2 shadow-lift sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Job title or keyword" className="border-0 pl-9 shadow-none focus-visible:ring-0" />
              </div>
              <div className="relative flex-1 sm:max-w-44">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="City" className="border-0 pl-9 shadow-none focus-visible:ring-0" />
              </div>
              <Button asChild>
                <Link to="/jobs">Search jobs</Link>
              </Button>
            </form>

            <div className="mt-8 flex gap-8">
              <Stat icon={<Briefcase className="size-4" />} value={`${jobs.length}`} label="Open roles" />
              <Stat icon={<Building2 className="size-4" />} value={`${companies.length}`} label="Employers" />
              <Stat icon={<Users className="size-4" />} value="12K+" label="Job seekers" />
            </div>
          </div>

          <div className="relative">
            <img
              src={heroImage}
              alt="Ethiopian professionals collaborating in a modern Addis Ababa office"
              width={1600}
              height={1200}
              className="w-full rounded-2xl object-cover shadow-lift"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold">Browse by category</h2>
            <p className="mt-1 text-sm text-muted-foreground">Find roles in the field you know best.</p>
          </div>
          <Link to="/categories" className="hidden text-sm font-medium text-accent hover:underline sm:block">
            All categories
          </Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.slice(0, 8).map((cat) => (
            <Link
              key={cat.slug}
              to="/jobs"
              search={{ category: cat.name }}
              className="rounded-xl border border-border bg-card p-4 shadow-soft transition-colors hover:border-accent/60"
            >
              <p className="font-display text-sm font-semibold">{cat.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{cat.jobs} open roles</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold">Latest openings</h2>
            <p className="mt-1 text-sm text-muted-foreground">Freshly posted by verified employers.</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/jobs">
              View all <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {latest.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 font-display text-2xl font-semibold text-primary-foreground">
        <span className="text-gold">{icon}</span>
        {value}
      </p>
      <p className="text-xs text-primary-foreground/70">{label}</p>
    </div>
  );
}
