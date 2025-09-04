-- posts (if not already present for Library/Calendar)
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  platforms text[] default '{}',
  status text check (status in ('draft','scheduled','published','error')) default 'draft',
  scheduled_at timestamptz,
  source text default 'generated',
  style text,
  created_at timestamptz default now()
);

-- agent_sessions (for traceability)
create table if not exists agent_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mode text check (mode in ('chat','post','lead','email')) not null,
  input text,
  output text,
  meta jsonb,
  created_at timestamptz default now()
);

-- lead magnets
create table if not exists lead_magnets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  type text check (type in ('checklist','guide','calculator','mini-guide')) not null,
  content text not null,
  hooks text[],
  created_at timestamptz default now()
);

-- emails
create table if not exists emails (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  body text not null,
  email_type text,
  segment_id text,
  created_at timestamptz default now()
);

-- RLS
alter table posts enable row level security;
alter table agent_sessions enable row level security;
alter table lead_magnets enable row level security;
alter table emails enable row level security;

-- Policies: users can only see and write their own rows
do $$ begin
  create policy "posts_owner_read" on posts for select using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "posts_owner_write" on posts for insert with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "posts_owner_update" on posts for update using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "posts_owner_delete" on posts for delete using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- Repeat for other tables
do $$ begin
  create policy "agent_sessions_read" on agent_sessions for select using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "agent_sessions_insert" on agent_sessions for insert with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "lead_magnets_read" on lead_magnets for select using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "lead_magnets_write" on lead_magnets for insert with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "lead_magnets_update" on lead_magnets for update using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "emails_read" on emails for select using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "emails_write" on emails for insert with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "emails_update" on emails for update using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;