import Link from "next/link";
import { getContent } from "@/lib/cms-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { profile, projects } = await getContent();
  const publishedProjects = projects.filter((project) => project.status === "published");
  const featuredProjects = publishedProjects.filter((project) => project.featured);

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#24211c]">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <Link href="/" className="text-sm font-bold uppercase tracking-[0.2em]">
          {profile.name}
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-sm font-semibold">
            CMS
          </Link>
          <a
            href={`mailto:${profile.email}`}
            className="rounded-md bg-[#24211c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#403a31]"
          >
            Contact
          </a>
        </div>
      </nav>

      <section className="mx-auto grid min-h-[76vh] w-full max-w-7xl items-end gap-10 px-5 pb-10 pt-12 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-10">
        <div>
          <p className="mb-5 text-sm font-semibold text-[#8a5b2f]">{profile.availability}</p>
          <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] sm:text-6xl lg:text-7xl">
            {profile.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5d574e]">{profile.bio}</p>
        </div>
        <aside className="border-l border-[#d8d0c2] pl-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a5b2f]">
            Based in
          </p>
          <p className="mt-2 text-2xl font-semibold">{profile.location}</p>
          <div className="mt-8 grid gap-3">
            {profile.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="w-fit border-b border-[#24211c] pb-1 text-sm font-semibold"
                target="_blank"
                rel="noreferrer"
              >
                {social.label}
              </a>
            ))}
          </div>
        </aside>
      </section>

      <section className="bg-white px-5 py-12 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a5b2f]">
                Featured work
              </p>
              <h2 className="mt-2 text-3xl font-semibold">Published case studies</h2>
            </div>
            <p className="text-sm text-[#6f675c]">
              Rendered on the server from CMS content.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {featuredProjects.map((project) => (
              <article
                key={project.id}
                className="rounded-lg border border-[#d8d0c2] bg-[#fbfaf7] p-6"
              >
                <div className="mb-8 flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-[#8a5b2f]">{project.role}</span>
                  <span className="text-sm text-[#6f675c]">{project.year}</span>
                </div>
                <h3 className="text-2xl font-semibold">{project.title}</h3>
                <p className="mt-4 leading-7 text-[#5d574e]">{project.summary}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span
                      key={item}
                      className="rounded-md border border-[#d8d0c2] px-2.5 py-1 text-xs font-semibold"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <a
                  href={project.url}
                  className="mt-8 inline-flex rounded-md bg-[#8a5b2f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#6d4421]"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open project
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
