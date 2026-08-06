import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-base font-semibold">EthioJobs Connect</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Connecting Ethiopian talent with employers who are hiring now.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <Link to="/jobs" className="hover:text-foreground">
            Jobs
          </Link>
          <Link to="/companies" className="hover:text-foreground">
            Companies
          </Link>
          <Link to="/categories" className="hover:text-foreground">
            Categories
          </Link>
          <Link to="/about" className="hover:text-foreground">
            About
          </Link>
          <Link to="/contact" className="hover:text-foreground">
            Contact
          </Link>
        </div>
      </div>
      <div className="border-t border-border/70">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} EthioJobs Connect. Addis Ababa, Ethiopia.
        </p>
      </div>
    </footer>
  );
}
