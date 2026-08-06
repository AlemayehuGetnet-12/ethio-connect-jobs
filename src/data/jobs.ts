export type EmploymentType = "Full-time" | "Part-time" | "Contract" | "Internship" | "Remote";

export type Company = {
  id: string;
  name: string;
  industry: string;
  city: string;
  employees: string;
  website: string;
  verified: boolean;
  about: string;
  initials: string;
};

export type Job = {
  id: string;
  title: string;
  companyId: string;
  category: string;
  city: string;
  remote: boolean;
  employmentType: EmploymentType;
  experience: string;
  education: string;
  salaryMin: number;
  salaryMax: number;
  postedDaysAgo: number;
  deadline: string;
  applicants: number;
  skills: string[];
  summary: string;
  description: string;
  requirements: string[];
  benefits: string[];
};

export type JobWithCompany = Job & { company: Company | null };

export type CompanyWithCount = Company & { openJobs: number };

export type CategoryFacet = { name: string; slug: string; jobs: number };

export function formatSalary(min: number, max: number) {
  const f = (n: number) => `${(n / 1000).toFixed(0)}K`;
  return `ETB ${f(min)} – ${f(max)} / month`;
}
