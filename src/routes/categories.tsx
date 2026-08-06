import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { categories, jobs } from "@/data/jobs";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Job Categories in Ethiopia | EthioJobs Connect" },
      {
        name: "description",
        content:
          "Browse Ethiopian job vacancies by field: software and IT, banking, healthcare, engineering, logistics, education and more.",
      },
      { property: "og:title", content: "Job Categories in Ethiopia | EthioJobs Connect" },
      {
        property: "og:description",
        content: "Browse Ethiopian vacancies by professional field and specialisation.",
      },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">Categories</h1>
      <p className="mt-1 text-sm text-muted-foreground">Pick a field to see matching vacancies.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => {
          const count = jobs.filter((j) => j.category === cat.name).length;
          return (
            <Link
              key={cat.slug}
              to="/jobs"
              search={{ category: cat.name }}
              className="group flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-lift"
            >
              <div>
                <p className="font-display text-base font-semibold group-hover:text-accent">{cat.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {count} open {count === 1 ? "role" : "roles"}
                </p>
              </div>
              <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-accent" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
