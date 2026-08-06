import { createServerFn } from "@tanstack/react-start";

export const fetchJobs = createServerFn({ method: "GET" })
  .inputValidator(
    (input: {
      q?: string | undefined;
      category?: string | undefined;
      city?: string | undefined;
      type?: string | undefined;
      sort?: string | undefined;
      limit?: number | undefined;
    }) => input ?? {},
  )
  .handler(async ({ data }) => {
    const { queryJobs } = await import("./jobs.server");
    return queryJobs(data);
  });

export const fetchJobDetail = createServerFn({ method: "GET" })
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    const { queryJobDetail } = await import("./jobs.server");
    return queryJobDetail(data.id);
  });

export const fetchCompanies = createServerFn({ method: "GET" }).handler(async () => {
  const { queryCompanies } = await import("./jobs.server");
  return queryCompanies();
});

export const fetchCompanyProfile = createServerFn({ method: "GET" })
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    const { queryCompanyProfile } = await import("./jobs.server");
    return queryCompanyProfile(data.id);
  });

export const fetchFacets = createServerFn({ method: "GET" }).handler(async () => {
  const { queryFacets } = await import("./jobs.server");
  return queryFacets();
});
