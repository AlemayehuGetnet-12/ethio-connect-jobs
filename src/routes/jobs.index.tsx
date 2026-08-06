import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobCard } from "@/components/job-card";
import { categories, cities, jobs } from "@/data/jobs";

type JobSearch = {
  q?: string;
  category?: string;
  city?: string;
  type?: string;
  sort?: string;
};

const ANY = "any";

export const Route = createFileRoute("/jobs")({
  validateSearch: (search: Record<string, unknown>): JobSearch => ({
    q: typeof search['q'] === "string" ? search['q'] : undefined,
    category: typeof search['category'] === "string" ? search['category'] : undefined,
    city: typeof search['city'] === "string" ? search['city'] : undefined,
    type: typeof search['type'] === "string" ? search['type'] : undefined,
    sort: typeof search['sort'] === "string" ? search['sort'] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Browse Jobs in Ethiopia | EthioJobs Connect" },
      {
        name: "description",
        content:
          "Search and filter Ethiopian job vacancies by keyword, category, city, employment type and salary.",
      },
      { property: "og:title", content: "Browse Jobs in Ethiopia | EthioJobs Connect" },
      {
        property: "og:description",
        content: "Filter Ethiopian vacancies by keyword, category, city and employment type.",
      },
    ],
  }),
  component: BrowseJobs,
});

function BrowseJobs() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/jobs" });

  const setParam = (key: keyof JobSearch, value: string | undefined) =>
    navigate({
      search: (prev) => ({ ...prev, [key]: value === ANY || value === "" ? undefined : value }),
    });

  const q = (search.q ?? "").toLowerCase();
  let results = jobs.filter((job) => {
    const matchesQ =
      !q ||
      job.title.toLowerCase().includes(q) ||
      job.summary.toLowerCase().includes(q) ||
      job.skills.some((s) => s.toLowerCase().includes(q));
    const matchesCategory = !search.category || job.category === search.category;
    const matchesCity = !search.city || job.city === search.city;
    const matchesType = !search.type || job.employmentType === search.type;
    return matchesQ && matchesCategory && matchesCity && matchesType;
  });

  if (search.sort === "salary") results = [...results].sort((a, b) => b.salaryMax - a.salaryMax);
  else if (search.sort === "deadline")
    results = [...results].sort((a, b) => a.deadline.localeCompare(b.deadline));
  else if (search.sort === "popular")
    results = [...results].sort((a, b) => b.applicants - a.applicants);
  else results = [...results].sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);

  const activeFilters = [search.category, search.city, search.type].filter(Boolean) as string[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">Browse jobs</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {results.length} {results.length === 1 ? "role" : "roles"} matching your search.
      </p>

      <div className="mt-6 rounded-xl border border-border bg-card p-4 shadow-soft">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search.q ?? ""}
            onChange={(e) => setParam("q", e.target.value)}
            placeholder="Search by title, skill or keyword"
            className="pl-9"
          />
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Filter
            label="Category"
            value={search.category ?? ANY}
            onChange={(v) => setParam("category", v)}
            options={categories.map((c) => c.name)}
          />
          <Filter
            label="City"
            value={search.city ?? ANY}
            onChange={(v) => setParam("city", v)}
            options={cities}
          />
          <Filter
            label="Job type"
            value={search.type ?? ANY}
            onChange={(v) => setParam("type", v)}
            options={["Full-time", "Part-time", "Contract", "Internship"]}
          />
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Sort by</label>
            <Select value={search.sort ?? "latest"} onValueChange={(v) => setParam("sort", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="salary">Highest salary</SelectItem>
                <SelectItem value="deadline">Closing soon</SelectItem>
                <SelectItem value="popular">Most popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {activeFilters.length > 0 || search.q ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="size-3.5 text-muted-foreground" />
            {activeFilters.map((f) => (
              <Badge key={f} variant="secondary">
                {f}
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ search: {} })}
              className="h-7 text-xs"
            >
              Clear all
            </Button>
          </div>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {results.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {results.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-center">
          <p className="font-display text-lg font-semibold">No jobs match those filters</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a broader keyword or clear a filter to see more roles.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function Filter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={`Any ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY}>Any {label.toLowerCase()}</SelectItem>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
