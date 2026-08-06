import { queryOptions } from "@tanstack/react-query";
import {
  fetchCompanies,
  fetchCompanyProfile,
  fetchFacets,
  fetchJobDetail,
  fetchJobs,
} from "./jobs.functions";

export type JobsQueryInput = {
  q?: string | undefined;
  category?: string | undefined;
  city?: string | undefined;
  type?: string | undefined;
  sort?: string | undefined;
  limit?: number | undefined;
};

export const jobsQuery = (input: JobsQueryInput = {}) =>
  queryOptions({
    queryKey: ["jobs", input],
    queryFn: () => fetchJobs({ data: input }),
  });

export const jobDetailQuery = (id: string) =>
  queryOptions({
    queryKey: ["job", id],
    queryFn: () => fetchJobDetail({ data: { id } }),
  });

export const companiesQuery = () =>
  queryOptions({
    queryKey: ["companies"],
    queryFn: () => fetchCompanies(),
  });

export const companyProfileQuery = (id: string) =>
  queryOptions({
    queryKey: ["company", id],
    queryFn: () => fetchCompanyProfile({ data: { id } }),
  });

export const facetsQuery = () =>
  queryOptions({
    queryKey: ["job-facets"],
    queryFn: () => fetchFacets(),
  });
