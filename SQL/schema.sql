-- Run this file in Supabase Dashboard > SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.site_content (
  id text primary key check (id = 'main'),
  content jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null default '',
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now()
);

alter table public.site_content enable row level security;
alter table public.contact_messages enable row level security;

-- The browser never connects to Supabase directly. The serverless API uses the
-- service-role key from Vercel environment variables, so public roles get no access.
revoke all on public.site_content from anon, authenticated;
revoke all on public.contact_messages from anon, authenticated;
grant all on public.site_content to service_role;
grant all on public.contact_messages to service_role;

insert into public.site_content (id, content)
values (
  'main',
  $json$
  {
    "profile": {
      "name": "Hafiz Abdullah Abbas",
      "shortName": "HA",
      "headline": "Developer & Content Creator",
      "about": "I enjoy building for the web, creating digital experiences, and sharing what I make. This portfolio is where I bring my development work and creative projects together.",
      "contactEmail": "abdukhan42121@gmail.com",
      "location": "Pakistan",
      "availability": "Open to interesting projects"
    },
    "skills": ["Web Development", "Content Creation"],
    "education": [
      {"title": "Matriculation — Computer Science", "institution": "Punjab", "detail": "Computer Science"}
    ],
    "projects": [
      {"name": "EclipseNetwork", "category": "Minecraft Network", "description": "A Minecraft network project focused on building a community and delivering a memorable gameplay experience.", "link": "", "status": "Featured"}
    ],
    "socials": {
      "discord": "https://discord.gg/yyfPVzs6S",
      "youtube": "https://youtube.com/@g1yrexmc?si=CTa_itLup8EOuvbd",
      "tiktok": "https://www.tiktok.com/@user423492238",
      "snapchat": "https://www.snapchat.com/add/hafiz.saheb0?share_id=4So-DKyMUSE&locale=en-PK"
    },
    "theme": {"accent": "#3B82F6", "accentGlow": "#168BFF"}
  }
  $json$::jsonb
)
on conflict (id) do nothing;
