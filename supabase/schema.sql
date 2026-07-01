-- Emlak CRM - Supabase şema kurulumu
-- Supabase Dashboard > SQL Editor içine yapıştırıp "Run" ile çalıştırın.

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  "ownerId" uuid not null default auth.uid() references auth.users(id) on delete cascade,
  "createdAt" timestamptz not null default now(),
  "fullName" text not null,
  phone text not null,
  email text,
  region text,
  address text,
  "interestType" text,
  source text,
  notes text
);

create table public.calls (
  id uuid primary key default gen_random_uuid(),
  "ownerId" uuid not null default auth.uid() references auth.users(id) on delete cascade,
  "createdAt" timestamptz not null default now(),
  "contactId" uuid not null references public.contacts(id) on delete cascade,
  "callDate" text not null,
  result text,
  notes text
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  "ownerId" uuid not null default auth.uid() references auth.users(id) on delete cascade,
  "createdAt" timestamptz not null default now(),
  "contactId" uuid not null references public.contacts(id) on delete cascade,
  description text not null,
  status text not null default 'yeni',
  "nextFollowUpDate" text,
  notes text
);

alter table public.contacts enable row level security;
alter table public.calls enable row level security;
alter table public.leads enable row level security;

create policy "select own contacts" on public.contacts for select using ("ownerId" = auth.uid());
create policy "insert own contacts" on public.contacts for insert with check ("ownerId" = auth.uid());
create policy "update own contacts" on public.contacts for update using ("ownerId" = auth.uid());
create policy "delete own contacts" on public.contacts for delete using ("ownerId" = auth.uid());

create policy "select own calls" on public.calls for select using ("ownerId" = auth.uid());
create policy "insert own calls" on public.calls for insert with check ("ownerId" = auth.uid());
create policy "update own calls" on public.calls for update using ("ownerId" = auth.uid());
create policy "delete own calls" on public.calls for delete using ("ownerId" = auth.uid());

create policy "select own leads" on public.leads for select using ("ownerId" = auth.uid());
create policy "insert own leads" on public.leads for insert with check ("ownerId" = auth.uid());
create policy "update own leads" on public.leads for update using ("ownerId" = auth.uid());
create policy "delete own leads" on public.leads for delete using ("ownerId" = auth.uid());

alter publication supabase_realtime add table public.contacts;
alter publication supabase_realtime add table public.calls;
alter publication supabase_realtime add table public.leads;
