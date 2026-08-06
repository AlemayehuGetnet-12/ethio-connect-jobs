import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { facetsQuery } from "@/lib/jobs-queries";

export const Route = createFileRoute("/categories")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(facetsQuery());
  },
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
  errorComponent: ({ error }) => (
    <div role="alert" className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="font-display text-2xl font-semibold">Couldn’t load categories</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <p className="text-sm text-muted-foreground">No categories yet.</p>
    </div>
  ),
});

function CategoriesPage() {
  const { data: facets } = useSuspenseQuery(facetsQuery());

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">Categories</h1>
      <p className="mt-1 text-sm text-muted-foreground">Pick a field to see matching vacancies.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {facets.categories.map((cat) => (
          <Link
            key={cat.slug}
            to="/jobs"
            search={{ category: cat.name }}
            className="group flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-lift"
          >
            <div>
              <p className="font-display text-base font-semibold group-hover:text-accent">
                {cat.name}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {cat.jobs} open {cat.jobs === 1 ? "role" : "roles"}
              </p>
            </div>
            <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-accent" />
          </Link>
        ))}
      </div>
    </div>
  );
}
