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

export const categories = [
  { name: "Software & IT", slug: "software-it", jobs: 4 },
  { name: "Banking & Finance", slug: "banking-finance", jobs: 2 },
  { name: "Health & Medical", slug: "health-medical", jobs: 1 },
  { name: "Engineering", slug: "engineering", jobs: 1 },
  { name: "Sales & Marketing", slug: "sales-marketing", jobs: 2 },
  { name: "Logistics", slug: "logistics", jobs: 1 },
  { name: "Education", slug: "education", jobs: 1 },
  { name: "NGO & Development", slug: "ngo-development", jobs: 1 },
];

export const companies: Company[] = [
  {
    id: "aster-tech",
    name: "Aster Technologies",
    industry: "Software & IT",
    city: "Addis Ababa",
    employees: "120-250",
    website: "astertech.et",
    verified: true,
    about:
      "Aster Technologies builds digital payment and lending infrastructure used by banks and microfinance institutions across Ethiopia.",
    initials: "AT",
  },
  {
    id: "abay-bank-digital",
    name: "Abay Digital Bank",
    industry: "Banking & Finance",
    city: "Addis Ababa",
    employees: "1000+",
    website: "abaydigital.et",
    verified: true,
    about:
      "A digital-first banking group serving retail and SME customers with mobile-first accounts, savings and credit products.",
    initials: "AD",
  },
  {
    id: "sheba-health",
    name: "Sheba Health Group",
    industry: "Health & Medical",
    city: "Bahir Dar",
    employees: "500-1000",
    website: "shebahealth.et",
    verified: true,
    about:
      "A network of clinics and diagnostic centres across the Amhara region focused on affordable primary care.",
    initials: "SH",
  },
  {
    id: "rift-logistics",
    name: "Rift Valley Logistics",
    industry: "Logistics",
    city: "Adama",
    employees: "250-500",
    website: "riftlogistics.et",
    verified: false,
    about:
      "Freight forwarding and last-mile distribution connecting Djibouti corridor imports to regional Ethiopian markets.",
    initials: "RL",
  },
  {
    id: "enat-agro",
    name: "Enat Agro Industries",
    industry: "Engineering",
    city: "Hawassa",
    employees: "500-1000",
    website: "enatagro.et",
    verified: true,
    about:
      "Agro-processing group operating coffee, oilseed and packaged food plants in the Sidama and Oromia regions.",
    initials: "EA",
  },
  {
    id: "lucy-learning",
    name: "Lucy Learning",
    industry: "Education",
    city: "Addis Ababa",
    employees: "50-120",
    website: "lucylearning.et",
    verified: false,
    about:
      "An education technology company producing Amharic and Afaan Oromo learning content for grades 1-12.",
    initials: "LL",
  },
];

export const jobs: Job[] = [
  {
    id: "senior-frontend-engineer-aster",
    title: "Senior Frontend Engineer",
    companyId: "aster-tech",
    category: "Software & IT",
    city: "Addis Ababa",
    remote: true,
    employmentType: "Full-time",
    experience: "5+ years",
    education: "BSc in Computer Science or related",
    salaryMin: 65000,
    salaryMax: 95000,
    postedDaysAgo: 2,
    deadline: "2026-09-05",
    applicants: 48,
    skills: ["React", "TypeScript", "Tailwind CSS", "REST APIs", "Testing"],
    summary:
      "Lead the web experience for a payments platform used by more than two million Ethiopians every month.",
    description:
      "You will own the front-end architecture of our merchant and consumer dashboards, working closely with product design and backend teams to ship reliable, accessible interfaces on slow networks.",
    requirements: [
      "5+ years building production React applications",
      "Strong TypeScript and modern CSS skills",
      "Experience optimising for low-bandwidth mobile users",
      "Comfortable mentoring mid-level engineers",
    ],
    benefits: ["Hybrid schedule", "Private medical cover", "Annual learning budget", "Transport allowance"],
  },
  {
    id: "backend-engineer-nodejs-aster",
    title: "Backend Engineer (Node.js)",
    companyId: "aster-tech",
    category: "Software & IT",
    city: "Addis Ababa",
    remote: false,
    employmentType: "Full-time",
    experience: "3+ years",
    education: "BSc in Software Engineering",
    salaryMin: 52000,
    salaryMax: 78000,
    postedDaysAgo: 5,
    deadline: "2026-08-28",
    applicants: 91,
    skills: ["Node.js", "Express", "PostgreSQL", "Docker", "CI/CD"],
    summary: "Build and scale the APIs behind lending, KYC and settlement services.",
    description:
      "Join the core platform team designing resilient services that handle high transaction volumes with strict auditing and compliance requirements.",
    requirements: [
      "3+ years with Node.js in production",
      "Solid relational database design skills",
      "Understanding of authentication, authorisation and audit logging",
      "Experience with containerised deployments",
    ],
    benefits: ["Performance bonus", "Medical cover", "Lunch provided"],
  },
  {
    id: "mobile-developer-flutter-abay",
    title: "Mobile Developer (Flutter)",
    companyId: "abay-bank-digital",
    category: "Software & IT",
    city: "Addis Ababa",
    remote: false,
    employmentType: "Full-time",
    experience: "2+ years",
    education: "BSc in Computer Science",
    salaryMin: 45000,
    salaryMax: 68000,
    postedDaysAgo: 1,
    deadline: "2026-09-12",
    applicants: 27,
    skills: ["Flutter", "Dart", "REST APIs", "Firebase"],
    summary: "Ship new features to the bank's mobile app used by 4 million customers.",
    description:
      "You will work on account opening, transfers and savings journeys, with a strong focus on offline resilience and Amharic localisation.",
    requirements: [
      "2+ years shipping Flutter apps to stores",
      "Experience with secure storage and biometrics",
      "Amharic localisation experience is a plus",
    ],
    benefits: ["Staff loan scheme", "Pension", "Annual bonus"],
  },
  {
    id: "credit-analyst-abay",
    title: "SME Credit Analyst",
    companyId: "abay-bank-digital",
    category: "Banking & Finance",
    city: "Addis Ababa",
    remote: false,
    employmentType: "Full-time",
    experience: "4+ years",
    education: "BA in Accounting, Finance or Economics",
    salaryMin: 38000,
    salaryMax: 55000,
    postedDaysAgo: 8,
    deadline: "2026-08-22",
    applicants: 64,
    skills: ["Credit Risk", "Financial Modelling", "IFRS", "Excel"],
    summary: "Assess and structure credit facilities for small and medium enterprises.",
    description:
      "You will appraise loan applications, build cash-flow models and present recommendations to the credit committee.",
    requirements: [
      "4+ years in commercial or SME credit analysis",
      "Strong financial statement analysis",
      "Knowledge of NBE directives",
    ],
    benefits: ["Pension", "Medical cover", "Professional certification support"],
  },
  {
    id: "registered-nurse-sheba",
    title: "Registered Nurse - Outpatient",
    companyId: "sheba-health",
    category: "Health & Medical",
    city: "Bahir Dar",
    remote: false,
    employmentType: "Full-time",
    experience: "2+ years",
    education: "BSc in Nursing",
    salaryMin: 18000,
    salaryMax: 26000,
    postedDaysAgo: 3,
    deadline: "2026-08-30",
    applicants: 35,
    skills: ["Patient Care", "Triage", "Record Keeping"],
    summary: "Provide outpatient care across our Bahir Dar clinic network.",
    description:
      "You will triage patients, support physicians during consultations and maintain accurate clinical records.",
    requirements: [
      "Valid nursing licence",
      "2+ years clinical experience",
      "Fluent in Amharic and English",
    ],
    benefits: ["Shift allowance", "Medical cover for family", "Housing support"],
  },
  {
    id: "mechanical-engineer-enat",
    title: "Plant Mechanical Engineer",
    companyId: "enat-agro",
    category: "Engineering",
    city: "Hawassa",
    remote: false,
    employmentType: "Full-time",
    experience: "3+ years",
    education: "BSc in Mechanical Engineering",
    salaryMin: 32000,
    salaryMax: 48000,
    postedDaysAgo: 6,
    deadline: "2026-09-01",
    applicants: 22,
    skills: ["Preventive Maintenance", "Hydraulics", "AutoCAD", "Safety"],
    summary: "Keep our oilseed processing lines running at target availability.",
    description:
      "Own the preventive maintenance programme, lead breakdown response and drive equipment reliability improvements.",
    requirements: [
      "3+ years in food or agro-processing plants",
      "Hands-on maintenance planning experience",
      "Strong safety mindset",
    ],
    benefits: ["Site housing", "Transport", "Overtime pay"],
  },
  {
    id: "digital-marketing-lead-lucy",
    title: "Digital Marketing Lead",
    companyId: "lucy-learning",
    category: "Sales & Marketing",
    city: "Addis Ababa",
    remote: true,
    employmentType: "Full-time",
    experience: "3+ years",
    education: "BA in Marketing or Communications",
    salaryMin: 30000,
    salaryMax: 45000,
    postedDaysAgo: 4,
    deadline: "2026-09-10",
    applicants: 58,
    skills: ["Content Strategy", "Meta Ads", "SEO", "Analytics"],
    summary: "Grow our learner base across Addis Ababa and regional cities.",
    description:
      "You will run acquisition campaigns in Amharic and English, own the content calendar and report on funnel performance.",
    requirements: [
      "3+ years in digital marketing",
      "Proven paid social performance",
      "Excellent Amharic and English copywriting",
    ],
    benefits: ["Remote-friendly", "Quarterly bonus", "Device allowance"],
  },
  {
    id: "sales-representative-rift",
    title: "Field Sales Representative",
    companyId: "rift-logistics",
    category: "Sales & Marketing",
    city: "Adama",
    remote: false,
    employmentType: "Contract",
    experience: "1+ years",
    education: "Diploma or above",
    salaryMin: 14000,
    salaryMax: 22000,
    postedDaysAgo: 10,
    deadline: "2026-08-20",
    applicants: 73,
    skills: ["B2B Sales", "Negotiation", "CRM"],
    summary: "Win new freight accounts along the Adama-Djibouti corridor.",
    description:
      "You will prospect manufacturers and importers, quote freight services and manage the handover to operations.",
    requirements: ["1+ years field sales", "Driving licence", "Fluent Afaan Oromo and Amharic"],
    benefits: ["Commission", "Fuel allowance", "Phone credit"],
  },
  {
    id: "warehouse-supervisor-rift",
    title: "Warehouse Supervisor",
    companyId: "rift-logistics",
    category: "Logistics",
    city: "Adama",
    remote: false,
    employmentType: "Full-time",
    experience: "3+ years",
    education: "Diploma in Logistics or Supply Chain",
    salaryMin: 16000,
    salaryMax: 24000,
    postedDaysAgo: 7,
    deadline: "2026-08-26",
    applicants: 41,
    skills: ["Inventory Control", "Team Leadership", "WMS"],
    summary: "Run daily operations for a 6,000 sqm distribution warehouse.",
    description:
      "Manage inbound and outbound flows, stock accuracy and a team of 24 warehouse staff across two shifts.",
    requirements: ["3+ years warehouse supervision", "Inventory system experience", "Strong reporting discipline"],
    benefits: ["Shift allowance", "Medical cover"],
  },
  {
    id: "curriculum-designer-lucy",
    title: "Curriculum Designer (Afaan Oromo)",
    companyId: "lucy-learning",
    category: "Education",
    city: "Addis Ababa",
    remote: true,
    employmentType: "Part-time",
    experience: "2+ years",
    education: "BA in Education",
    salaryMin: 12000,
    salaryMax: 20000,
    postedDaysAgo: 12,
    deadline: "2026-08-18",
    applicants: 19,
    skills: ["Curriculum Design", "Afaan Oromo", "Assessment"],
    summary: "Adapt grade 5-8 science lessons into Afaan Oromo.",
    description:
      "You will translate and adapt lesson plans, design assessments and review learner feedback with our content team.",
    requirements: ["Native Afaan Oromo", "2+ years teaching or curriculum work", "Comfortable with digital tools"],
    benefits: ["Flexible hours", "Fully remote"],
  },
  {
    id: "data-analyst-intern-aster",
    title: "Data Analyst Intern",
    companyId: "aster-tech",
    category: "Software & IT",
    city: "Addis Ababa",
    remote: false,
    employmentType: "Internship",
    experience: "Entry level",
    education: "Final year student or fresh graduate",
    salaryMin: 6000,
    salaryMax: 9000,
    postedDaysAgo: 1,
    deadline: "2026-09-15",
    applicants: 112,
    skills: ["SQL", "Python", "Data Visualisation"],
    summary: "Six-month paid internship on the analytics team.",
    description:
      "Support reporting on transaction trends, build dashboards and learn production analytics workflows.",
    requirements: ["Basic SQL", "Curiosity and attention to detail", "Available full-time for six months"],
    benefits: ["Paid internship", "Mentorship", "Possible full-time offer"],
  },
  {
    id: "project-officer-enat",
    title: "Community Project Officer",
    companyId: "enat-agro",
    category: "NGO & Development",
    city: "Hawassa",
    remote: false,
    employmentType: "Contract",
    experience: "3+ years",
    education: "BA in Development Studies or related",
    salaryMin: 22000,
    salaryMax: 32000,
    postedDaysAgo: 9,
    deadline: "2026-08-24",
    applicants: 30,
    skills: ["Stakeholder Engagement", "M&E", "Report Writing"],
    summary: "Lead smallholder farmer training programmes in the Sidama region.",
    description:
      "Coordinate outgrower training, track programme indicators and report to partners and regional authorities.",
    requirements: ["3+ years in community programmes", "Field-based work experience", "Fluent Sidaamu Afoo a plus"],
    benefits: ["Field allowance", "Vehicle support"],
  },
];

export const cities = Array.from(new Set(jobs.map((j) => j.city))).sort();

export function getCompany(id: string) {
  return companies.find((c) => c.id === id);
}

export function getJob(id: string) {
  return jobs.find((j) => j.id === id);
}

export function formatSalary(min: number, max: number) {
  const f = (n: number) => `${(n / 1000).toFixed(0)}K`;
  return `ETB ${f(min)} – ${f(max)} / month`;
}
