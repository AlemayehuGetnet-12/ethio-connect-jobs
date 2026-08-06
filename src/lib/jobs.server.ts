import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type {
  CategoryFacet,
  Company,
  CompanyWithCount,
  EmploymentType,
  Job,
  JobWithCompany,
} from "@/data/jobs";

type CompanyRow = Database["public"]["Tables"]["companies"]["Row"];
type JobRow = Database["public"]["Tables"]["jobs"]["Row"];

function getPublicClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export function toCompany(row: CompanyRow): Company {
  return {
    id: row.id,
    name: row.name,
    industry: row.industry,
    city: row.city,
    employees: row.employees,
    website: row.website,
    verified: row.verified,
    about: row.about,
    initials: row.initials,
  };
}

export function toJob(row: JobRow): Job {
  return {
    id: row.id,
    title: row.title,
    companyId: row.company_id,
    category: row.category,
    city: row.city,
    remote: row.remote,
    employmentType: row.employment_type as EmploymentType,
    experience: row.experience,
    education: row.education,
    salaryMin: row.salary_min,
    salaryMax: row.salary_max,
    postedDaysAgo: row.posted_days_ago,
    deadline: row.deadline,
    applicants: row.applicants,
    skills: row.skills,
    summary: row.summary,
    description: row.description,
    requirements: row.requirements,
    benefits: row.benefits,
  };
}

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export type JobFilters = {
  q?: string | undefined;
  category?: string | undefined;
  city?: string | undefined;
  type?: string | undefined;
  sort?: string | undefined;
  limit?: number | undefined;
};

export async function queryJobs(filters: JobFilters): Promise<JobWithCompany[]> {
  const supabase = getPublicClient();
  let query = supabase.from("jobs").select("*, companies(*)");

  if (filters.category) query = query.eq("category", filters.category);
  if (filters.city) query = query.eq("city", filters.city);
  if (filters.type) query = query.eq("employment_type", filters.type);
  if (filters.q) {
    const term = filters.q.replace(/[%,()]/g, " ").trim();
    if (term) {
      query = query.or(
        `title.ilike.%${term}%,summary.ilike.%${term}%,description.ilike.%${term}%`,
      );
    }
  }

  switch (filters.sort) {
    case "salary":
      query = query.order("salary_max", { ascending: false });
      break;
    case "deadline":
      query = query.order("deadline", { ascending: true });
      break;
    case "popular":
      query = query.order("applicants", { ascending: false });
      break;
    default:
      query = query.order("posted_days_ago", { ascending: true });
  }

  if (filters.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => {
    const { companies, ...job } = row as JobRow & { companies: CompanyRow | null };
    return { ...toJob(job as JobRow), company: companies ? toCompany(companies) : null };
  });
}

export async function queryJobDetail(id: string): Promise<JobWithCompany | null> {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*, companies(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const { companies, ...job } = data as JobRow & { companies: CompanyRow | null };
  return { ...toJob(job as JobRow), company: companies ? toCompany(companies) : null };
}

export async function queryCompanies(): Promise<CompanyWithCount[]> {
  const supabase = getPublicClient();
  const [companiesRes, jobsRes] = await Promise.all([
    supabase.from("companies").select("*").order("name"),
    supabase.from("jobs").select("company_id"),
  ]);
  if (companiesRes.error) throw new Error(companiesRes.error.message);
  if (jobsRes.error) throw new Error(jobsRes.error.message);

  const counts = new Map<string, number>();
  for (const row of jobsRes.data ?? []) {
    counts.set(row.company_id, (counts.get(row.company_id) ?? 0) + 1);
  }
  return (companiesRes.data ?? []).map((row) => ({
    ...toCompany(row),
    openJobs: counts.get(row.id) ?? 0,
  }));
}

export async function queryCompanyProfile(
  id: string,
): Promise<{ company: Company; openJobs: JobWithCompany[] } | null> {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const company = toCompany(data);
  const jobs = await queryJobs({});
  return { company, openJobs: jobs.filter((j) => j.companyId === company.id) };
}

export async function queryFacets(): Promise<{
  categories: CategoryFacet[];
  cities: string[];
  jobCount: number;
  companyCount: number;
}> {
  const supabase = getPublicClient();
  const [jobsRes, companyCountRes] = await Promise.all([
    supabase.from("jobs").select("category, city"),
    supabase.from("companies").select("*", { count: "exact", head: true }),
  ]);
  if (jobsRes.error) throw new Error(jobsRes.error.message);
  if (companyCountRes.error) throw new Error(companyCountRes.error.message);

  const rows = jobsRes.data ?? [];
  const categoryCounts = new Map<string, number>();
  const cities = new Set<string>();
  for (const row of rows) {
    categoryCounts.set(row.category, (categoryCounts.get(row.category) ?? 0) + 1);
    cities.add(row.city);
  }

  return {
    categories: [...categoryCounts.entries()]
      .map(([name, jobs]) => ({ name, slug: slugify(name), jobs }))
      .sort((a, b) => b.jobs - a.jobs || a.name.localeCompare(b.name)),
    cities: [...cities].sort(),
    jobCount: rows.length,
    companyCount: companyCountRes.count ?? 0,
  };
}
