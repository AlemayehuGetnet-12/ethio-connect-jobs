import { Link } from "@tanstack/react-router";
import { MapPin, Clock, BadgeCheck, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatSalary, getCompany, type Job } from "@/data/jobs";

export function JobCard({ job }: { job: Job }) {
  const company = getCompany(job.companyId);

  return (
    <Link
      to="/jobs/$jobId"
      params={{ jobId: job.id }}
      className="group block rounded-xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-lift"
    >
      <div className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-secondary font-display text-sm font-semibold text-secondary-foreground">
          {company?.initials}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-base font-semibold group-hover:text-accent">
            {job.title}
          </h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            {company?.name}
            {company?.verified ? <BadgeCheck className="size-4 text-accent" /> : null}
          </p>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{job.summary}</p>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" /> {job.city}
              {job.remote ? " · Remote" : ""}
            </span>
            <span className="inline-flex items-center gap-1">
              <Wallet className="size-3.5" /> {formatSalary(job.salaryMin, job.salaryMax)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" />
              {job.postedDaysAgo === 0 ? "Today" : `${job.postedDaysAgo}d ago`}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            <Badge variant="secondary">{job.employmentType}</Badge>
            <Badge variant="outline">{job.category}</Badge>
            <Badge variant="outline">{job.experience}</Badge>
          </div>
        </div>
      </div>
    </Link>
  );
}
