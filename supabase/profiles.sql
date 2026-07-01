-- Kullanici profilleri ve admin yetkisi
-- Supabase Dashboard > SQL Editor icine yapistirip "Run" ile calistirin.
-- schema.sql'den SONRA calistirilmalidir.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  "fullName" text,
  role text not null default 'user' check (role in ('admin', 'user')),
  "createdAt" timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- RLS icinde ayni tabloya recursive sorgu sorununu onlemek icin guvenli yardimci fonksiyon
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create policy "select own or admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

create policy "admin update" on public.profiles
  for update using (public.is_admin());

-- Yeni auth.users kaydinda otomatik profil satiri olusturur (varsayilan role='user')
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Mevcut kullanicilari geriye donuk doldur
insert into public.profiles (id, email)
  select id, email from auth.users
  on conflict (id) do nothing;

-- Ilk admin kullanicisini belirle
update public.profiles set role = 'admin' where email = 'tolgakesen@gmail.com';
