-- A) Stronger ownership: FK to auth.users
alter table lead_magnet_ideas
  add constraint if not exists lead_magnet_ideas_user_fk
  foreign key (user_id) references auth.users(id) on delete cascade;

-- E) Default for sources jsonb
alter table lead_magnet_ideas
  alter column sources set default '{}'::jsonb;

-- (Optional nicety) updated_at on ideas
alter table lead_magnet_ideas add column if not exists updated_at timestamptz;

-- B) updated_at trigger for posts (and ideas)
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end$$;

drop trigger if exists trg_posts_set_updated_at on posts;
create trigger trg_posts_set_updated_at
before update on posts
for each row execute function set_updated_at();

drop trigger if exists trg_lmi_set_updated_at on lead_magnet_ideas;
create trigger trg_lmi_set_updated_at
before update on lead_magnet_ideas
for each row execute function set_updated_at();

-- C) Scheduling integrity (status 'scheduled' needs scheduled_at)
do $$
begin
  alter table posts
  add constraint posts_scheduled_requires_time
  check (status <> 'scheduled' or scheduled_at is not null);
exception when duplicate_object then null; end$$;

-- D) Calendar-friendly indexes
create index if not exists posts_user_schedule_idx
  on posts (user_id, scheduled_at)
  where status = 'scheduled';

create index if not exists posts_user_status_idx
  on posts (user_id, status);

-- F) RLS for posts (skip if you already have these)
alter table posts enable row level security;

do $$ begin
  create policy posts_owner_select on posts
    for select using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy posts_owner_insert on posts
    for insert with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy posts_owner_update on posts
    for update using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy posts_owner_delete on posts
    for delete using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;