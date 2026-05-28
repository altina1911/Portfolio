"use client";

import { FormEvent, useMemo, useState } from "react";
import type { PortfolioContent, Profile, Project } from "@/lib/cms-store";

type ProjectForm = {
  title: string;
  summary: string;
  role: string;
  stack: string;
  year: string;
  url: string;
  status: Project["status"];
  featured: boolean;
};

export function CmsEditor({ initialContent }: { initialContent: PortfolioContent }) {
  const [profile, setProfile] = useState(initialContent.profile);
  const [projects, setProjects] = useState(initialContent.projects);
  const [projectForm, setProjectForm] = useState<ProjectForm>({
    title: "",
    summary: "",
    role: "",
    stack: "Next.js, TypeScript",
    year: new Date().getFullYear().toString(),
    url: "https://",
    status: "published",
    featured: false,
  });
  const [message, setMessage] = useState("Ready");

  const publishedCount = useMemo(
    () => projects.filter((project) => project.status === "published").length,
    [projects],
  );
  const featuredCount = useMemo(
    () => projects.filter((project) => project.featured).length,
    [projects],
  );

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Saving profile...");
    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    const data = (await response.json()) as Profile;
    setProfile(data);
    setMessage("Profile saved");
  }

  async function createProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Creating project...");
    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectForm),
    });
    const data = (await response.json()) as Project;
    setProjects((current) => [data, ...current.filter((project) => project.id !== data.id)]);
    setProjectForm((current) => ({ ...current, title: "", summary: "", role: "" }));
    setMessage("Project created");
  }

  async function deleteProject(id: string) {
    setMessage("Deleting project...");
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setProjects((current) => current.filter((project) => project.id !== id));
    setMessage("Project deleted");
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Total projects" value={projects.length.toString()} />
        <Metric label="Published" value={publishedCount.toString()} />
        <Metric label="Featured" value={featuredCount.toString()} />
        <Metric label="API status" value={message} compact />
      </div>

      <section className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
        <form
          onSubmit={saveProfile}
          className="rounded-lg border border-[#d8d0c2] bg-white p-5 shadow-sm"
        >
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a5b2f]">
              Profile
            </p>
            <h1 className="mt-2 text-2xl font-semibold">Edit portfolio identity</h1>
          </div>
          <Field
            label="Name"
            value={profile.name}
            onChange={(value) => setProfile((current) => ({ ...current, name: value }))}
          />
          <Field
            label="Headline"
            value={profile.headline}
            onChange={(value) => setProfile((current) => ({ ...current, headline: value }))}
          />
          <Field
            label="Location"
            value={profile.location}
            onChange={(value) => setProfile((current) => ({ ...current, location: value }))}
          />
          <label className="mb-4 block">
            <span className="mb-2 block text-sm font-semibold">Bio</span>
            <textarea
              value={profile.bio}
              rows={5}
              onChange={(event) =>
                setProfile((current) => ({ ...current, bio: event.target.value }))
              }
              className="w-full rounded-md border border-[#d8d0c2] px-3 py-2 outline-none focus:border-[#8a5b2f]"
            />
          </label>
          <Field
            label="Email"
            value={profile.email}
            onChange={(value) => setProfile((current) => ({ ...current, email: value }))}
          />
          <Field
            label="Availability"
            value={profile.availability}
            onChange={(value) => setProfile((current) => ({ ...current, availability: value }))}
          />
          <button
            type="submit"
            className="mt-2 rounded-md bg-[#24211c] px-4 py-2 text-sm font-semibold text-white"
          >
            Save profile
          </button>
        </form>

        <div className="grid gap-6">
          <form
            onSubmit={createProject}
            className="rounded-lg border border-[#d8d0c2] bg-white p-5 shadow-sm"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a5b2f]">
                  New project
                </p>
                <h2 className="mt-2 text-2xl font-semibold">Publish a case study</h2>
              </div>
              <code className="rounded bg-[#f7f5f0] px-2 py-1 text-xs">POST /api/projects</code>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Title"
                value={projectForm.title}
                onChange={(value) => setProjectForm((current) => ({ ...current, title: value }))}
                required
              />
              <Field
                label="Role"
                value={projectForm.role}
                onChange={(value) => setProjectForm((current) => ({ ...current, role: value }))}
                required
              />
              <Field
                label="Stack"
                value={projectForm.stack}
                onChange={(value) => setProjectForm((current) => ({ ...current, stack: value }))}
              />
              <Field
                label="Year"
                value={projectForm.year}
                onChange={(value) => setProjectForm((current) => ({ ...current, year: value }))}
              />
              <Field
                label="URL"
                value={projectForm.url}
                onChange={(value) => setProjectForm((current) => ({ ...current, url: value }))}
              />
              <label className="block">
                <span className="mb-2 block text-sm font-semibold">Status</span>
                <select
                  value={projectForm.status}
                  onChange={(event) =>
                    setProjectForm((current) => ({
                      ...current,
                      status: event.target.value as Project["status"],
                    }))
                  }
                  className="w-full rounded-md border border-[#d8d0c2] bg-white px-3 py-2 outline-none focus:border-[#8a5b2f]"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </label>
            </div>
            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-semibold">Summary</span>
              <textarea
                value={projectForm.summary}
                required
                rows={4}
                onChange={(event) =>
                  setProjectForm((current) => ({ ...current, summary: event.target.value }))
                }
                className="w-full rounded-md border border-[#d8d0c2] px-3 py-2 outline-none focus:border-[#8a5b2f]"
              />
            </label>
            <label className="mt-3 flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={projectForm.featured}
                onChange={(event) =>
                  setProjectForm((current) => ({ ...current, featured: event.target.checked }))
                }
              />
              Feature on homepage
            </label>
            <button
              type="submit"
              className="mt-5 rounded-md bg-[#8a5b2f] px-4 py-2 text-sm font-semibold text-white"
            >
              Create project
            </button>
          </form>

          <div className="rounded-lg border border-[#d8d0c2] bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a5b2f]">
                  Content
                </p>
                <h2 className="mt-2 text-2xl font-semibold">Projects</h2>
              </div>
              <code className="rounded bg-[#f7f5f0] px-2 py-1 text-xs">GET /api/projects</code>
            </div>
            <div className="overflow-hidden rounded-md border border-[#d8d0c2]">
              <div className="grid grid-cols-[1.25fr_0.6fr_0.45fr_0.45fr] bg-[#f7f5f0] px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#6f675c]">
                <span>Project</span>
                <span>Status</span>
                <span>Year</span>
                <span>Action</span>
              </div>
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="grid grid-cols-[1.25fr_0.6fr_0.45fr_0.45fr] border-t border-[#d8d0c2] px-4 py-4 text-sm"
                >
                  <div>
                    <p className="font-semibold">{project.title}</p>
                    <p className="mt-1 max-w-md text-[#6f675c]">{project.summary}</p>
                  </div>
                  <span className="capitalize">{project.status}</span>
                  <span>{project.year}</span>
                  <button
                    type="button"
                    onClick={() => deleteProject(project.id)}
                    className="h-fit rounded-md border border-[#d8d0c2] px-2 py-1 text-xs font-semibold"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Metric({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div className="rounded-lg border border-[#d8d0c2] bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-[#6f675c]">{label}</p>
      <p className={compact ? "mt-3 text-lg font-semibold" : "mt-3 text-4xl font-semibold"}>
        {value}
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <input
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-[#d8d0c2] px-3 py-2 outline-none focus:border-[#8a5b2f]"
      />
    </label>
  );
}
