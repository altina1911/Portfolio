export type ProjectStatus = "draft" | "published";

export type Project = {
  id: string;
  title: string;
  summary: string;
  role: string;
  stack: string[];
  year: string;
  url: string;
  status: ProjectStatus;
  featured: boolean;
};

export type Profile = {
  name: string;
  headline: string;
  location: string;
  bio: string;
  email: string;
  availability: string;
  socials: {
    label: string;
    href: string;
  }[];
};

export type PortfolioContent = {
  profile: Profile;
  projects: Project[];
};

const seedContent: PortfolioContent = {
  profile: {
    name: "Alex Morgan",
    headline: "Full-stack developer building fast portfolio experiences.",
    location: "Berlin, Germany",
    bio: "I design and ship polished web products with a focus on server-rendered interfaces, thoughtful content systems, and measurable product outcomes.",
    email: "alex@example.com",
    availability: "Available for freelance and product teams",
    socials: [
      { label: "GitHub", href: "https://github.com" },
      { label: "LinkedIn", href: "https://linkedin.com" },
      { label: "Website", href: "https://example.com" },
    ],
  },
  projects: [
    {
      id: "studio-dashboard",
      title: "Studio Dashboard",
      summary:
        "A server-rendered operations dashboard for a creative studio, with editorial workflows and client-ready reporting.",
      role: "Lead developer",
      stack: ["Next.js", "TypeScript", "Node.js", "PostgreSQL"],
      year: "2026",
      url: "https://vercel.com",
      status: "published",
      featured: true,
    },
    {
      id: "launch-site",
      title: "Launch Site CMS",
      summary:
        "A lightweight publishing system for campaign pages, reusable sections, and previewable content updates.",
      role: "Frontend engineer",
      stack: ["React", "Tailwind CSS", "Vercel"],
      year: "2025",
      url: "https://nextjs.org",
      status: "published",
      featured: true,
    },
    {
      id: "case-study-engine",
      title: "Case Study Engine",
      summary:
        "Structured case study templates for product teams who need fast updates without custom page work.",
      role: "Product engineer",
      stack: ["Next.js", "API Routes", "TypeScript"],
      year: "2025",
      url: "https://nodejs.org",
      status: "draft",
      featured: false,
    },
  ],
};

const globalStore = globalThis as typeof globalThis & {
  portfolioCmsContent?: PortfolioContent;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseApiKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function hasSupabaseConfig() {
  return Boolean(supabaseUrl && supabaseApiKey);
}

async function supabaseRequest<T>(path: string, init: RequestInit = {}) {
  if (!supabaseUrl || !supabaseApiKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: supabaseApiKey,
      Authorization: `Bearer ${supabaseApiKey}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase request failed: ${response.status} ${message}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

function getMemoryContent(): PortfolioContent {
  if (!globalStore.portfolioCmsContent) {
    globalStore.portfolioCmsContent = structuredClone(seedContent);
  }

  return globalStore.portfolioCmsContent;
}

export async function getContent(): Promise<PortfolioContent> {
  if (!hasSupabaseConfig()) {
    return getMemoryContent();
  }

  const [profile, projects] = await Promise.all([getProfile(), getProjects()]);
  return { profile, projects };
}

export async function getPublishedProjects() {
  const content = await getContent();
  return content.projects.filter((project) => project.status === "published");
}

export async function getProfile(): Promise<Profile> {
  if (!hasSupabaseConfig()) {
    return getMemoryContent().profile;
  }

  const rows = await supabaseRequest<Profile[]>(
    "portfolio_profile?id=eq.main&select=name,headline,location,bio,email,availability,socials",
  );

  if (rows[0]) {
    return rows[0];
  }

  const [profile] = await supabaseRequest<Profile[]>("portfolio_profile?select=name,headline,location,bio,email,availability,socials", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ id: "main", ...seedContent.profile }),
  });

  return profile;
}

export async function getProjects(): Promise<Project[]> {
  if (!hasSupabaseConfig()) {
    return getMemoryContent().projects;
  }

  return supabaseRequest<Project[]>(
    "portfolio_projects?select=id,title,summary,role,stack,year,url,status,featured&order=created_at.desc",
  );
}

export async function getProject(id: string): Promise<Project | undefined> {
  if (!hasSupabaseConfig()) {
    return getMemoryContent().projects.find((item) => item.id === id);
  }

  const rows = await supabaseRequest<Project[]>(
    `portfolio_projects?id=eq.${encodeURIComponent(id)}&select=id,title,summary,role,stack,year,url,status,featured`,
  );

  return rows[0];
}

export async function updateProfile(profile: Partial<Profile>) {
  if (hasSupabaseConfig()) {
    const [updatedProfile] = await supabaseRequest<Profile[]>(
      "portfolio_profile?id=eq.main&select=name,headline,location,bio,email,availability,socials",
      {
        method: "PATCH",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({
          ...profile,
          updated_at: new Date().toISOString(),
        }),
      },
    );

    return updatedProfile;
  }

  const content = getMemoryContent();
  content.profile = {
    ...content.profile,
    ...profile,
    socials: profile.socials ?? content.profile.socials,
  };

  return content.profile;
}

export async function upsertProject(project: Omit<Project, "id"> & { id?: string }) {
  const id = project.id || slugify(project.title);
  const nextProject: Project = {
    ...project,
    id,
    stack: project.stack.filter(Boolean),
  };

  if (hasSupabaseConfig()) {
    const [savedProject] = await supabaseRequest<Project[]>(
      "portfolio_projects?on_conflict=id&select=id,title,summary,role,stack,year,url,status,featured",
      {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify({
          ...nextProject,
          updated_at: new Date().toISOString(),
        }),
      },
    );

    return savedProject;
  }

  const content = getMemoryContent();
  const index = content.projects.findIndex((item) => item.id === id);

  if (index >= 0) {
    content.projects[index] = nextProject;
  } else {
    content.projects.unshift(nextProject);
  }

  return nextProject;
}

export async function deleteProject(id: string) {
  if (hasSupabaseConfig()) {
    const deletedRows = await supabaseRequest<Project[]>(
      `portfolio_projects?id=eq.${encodeURIComponent(id)}&select=id`,
      {
        method: "DELETE",
        headers: { Prefer: "return=representation" },
      },
    );

    return deletedRows.length > 0;
  }

  const content = getMemoryContent();
  const before = content.projects.length;
  content.projects = content.projects.filter((project) => project.id !== id);
  return content.projects.length !== before;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
