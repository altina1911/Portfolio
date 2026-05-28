create table if not exists public.portfolio_profile (
  id text primary key default 'main',
  name text not null,
  headline text not null,
  location text not null,
  bio text not null,
  email text not null,
  availability text not null,
  socials jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_projects (
  id text primary key,
  title text not null,
  summary text not null,
  role text not null,
  stack text[] not null default '{}',
  year text not null,
  url text not null,
  status text not null default 'published' check (status in ('draft', 'published')),
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.portfolio_profile enable row level security;
alter table public.portfolio_projects enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'portfolio_profile'
      and policyname = 'Public profile read'
  ) then
    create policy "Public profile read"
      on public.portfolio_profile
      for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'portfolio_projects'
      and policyname = 'Public published project read'
  ) then
    create policy "Public published project read"
      on public.portfolio_projects
      for select
      using (status = 'published');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'portfolio_profile'
      and policyname = 'Public profile insert'
  ) then
    create policy "Public profile insert"
      on public.portfolio_profile
      for insert
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'portfolio_profile'
      and policyname = 'Public profile update'
  ) then
    create policy "Public profile update"
      on public.portfolio_profile
      for update
      using (true)
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'portfolio_projects'
      and policyname = 'Public project read'
  ) then
    create policy "Public project read"
      on public.portfolio_projects
      for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'portfolio_projects'
      and policyname = 'Public project insert'
  ) then
    create policy "Public project insert"
      on public.portfolio_projects
      for insert
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'portfolio_projects'
      and policyname = 'Public project update'
  ) then
    create policy "Public project update"
      on public.portfolio_projects
      for update
      using (true)
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'portfolio_projects'
      and policyname = 'Public project delete'
  ) then
    create policy "Public project delete"
      on public.portfolio_projects
      for delete
      using (true);
  end if;
end
$$;

insert into public.portfolio_profile (
  id,
  name,
  headline,
  location,
  bio,
  email,
  availability,
  socials
) values (
  'main',
  'Alex Morgan',
  'Full-stack developer building fast portfolio experiences.',
  'Berlin, Germany',
  'I design and ship polished web products with a focus on server-rendered interfaces, thoughtful content systems, and measurable product outcomes.',
  'alex@example.com',
  'Available for freelance and product teams',
  '[{"label":"GitHub","href":"https://github.com"},{"label":"LinkedIn","href":"https://linkedin.com"},{"label":"Website","href":"https://example.com"}]'::jsonb
) on conflict (id) do nothing;

insert into public.portfolio_projects (
  id,
  title,
  summary,
  role,
  stack,
  year,
  url,
  status,
  featured
) values
(
  'studio-dashboard',
  'Studio Dashboard',
  'A server-rendered operations dashboard for a creative studio, with editorial workflows and client-ready reporting.',
  'Lead developer',
  array['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'],
  '2026',
  'https://vercel.com',
  'published',
  true
),
(
  'launch-site',
  'Launch Site CMS',
  'A lightweight publishing system for campaign pages, reusable sections, and previewable content updates.',
  'Frontend engineer',
  array['React', 'Tailwind CSS', 'Vercel'],
  '2025',
  'https://nextjs.org',
  'published',
  true
),
(
  'case-study-engine',
  'Case Study Engine',
  'Structured case study templates for product teams who need fast updates without custom page work.',
  'Product engineer',
  array['Next.js', 'API Routes', 'TypeScript'],
  '2025',
  'https://nodejs.org',
  'draft',
  false
) on conflict (id) do nothing;
