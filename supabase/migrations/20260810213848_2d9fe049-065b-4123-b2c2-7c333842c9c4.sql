-- ===== roles =====
create type public.app_role as enum ('admin','customer');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile read" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "own profile write" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());
create policy "admins manage roles" on public.user_roles for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone')
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'customer') on conflict do nothing;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- ===== content tables =====
create table public.products (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  category text not null default 'outerwear',
  price numeric not null default 0,
  original_price numeric,
  currency text not null default '$',
  rating numeric not null default 5,
  reviews_count int not null default 0,
  eco_badge text not null default '',
  eco_impact_text text not null default '',
  co2_saved_kg numeric not null default 0,
  images jsonb not null default '[]'::jsonb,
  colors jsonb not null default '[]'::jsonb,
  sizes jsonb not null default '[]'::jsonb,
  composition text not null default '',
  fit_description text not null default '',
  is_new boolean not null default false,
  is_best_seller boolean not null default false,
  is_sustainable boolean not null default false,
  description text not null default '',
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.collections (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  subtitle text not null default '',
  image text not null default '',
  tag text not null default '',
  item_count int not null default 0,
  slug text not null default '',
  is_published boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table public.hero_slides (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  subtitle text not null default '',
  tagline text not null default '',
  image text not null default '',
  badge text not null default '',
  impact text not null default '',
  is_published boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table public.promo_banners (
  id text primary key default gen_random_uuid()::text,
  eyebrow text not null default '',
  title text not null default '',
  description text not null default '',
  badge text not null default '',
  cta_label text not null default '',
  image text not null default '',
  is_published boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table public.eco_metrics (
  id text primary key default gen_random_uuid()::text,
  icon text not null default 'Award',
  title text not null default '',
  description text not null default '',
  is_published boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table public.materials (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  badge text not null default '',
  tagline text not null default '',
  image text not null default '',
  stats jsonb not null default '[]'::jsonb,
  features jsonb not null default '[]'::jsonb,
  is_published boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table public.lookbook_outfits (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  subtitle text not null default '',
  image text not null default '',
  hotspots jsonb not null default '[]'::jsonb,
  is_published boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table public.instagram_posts (
  id text primary key default gen_random_uuid()::text,
  handle text not null default '',
  image text not null default '',
  likes int not null default 0,
  caption text not null default '',
  product_id text,
  is_published boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table public.sections (
  key text primary key,
  label text not null,
  is_visible boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- grants + rls for content tables
do $$
declare t text;
begin
  foreach t in array array['products','collections','hero_slides','promo_banners','eco_metrics','materials','lookbook_outfits','instagram_posts','sections','site_settings']
  loop
    execute format('grant select on public.%I to anon', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "public read %1$s" on public.%1$I for select using (true)', t);
    execute format('create policy "admins manage %1$s" on public.%1$I for all to authenticated using (public.has_role(auth.uid(),''admin'')) with check (public.has_role(auth.uid(),''admin''))', t);
    execute format('create trigger set_updated_at_%1$s before update on public.%1$I for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- ===== orders =====
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_email text,
  customer_phone text not null,
  shipping_address text not null default '',
  city text not null default '',
  notes text not null default '',
  subtotal numeric not null default 0,
  shipping numeric not null default 0,
  total numeric not null default 0,
  currency text not null default '$',
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.orders to authenticated;
grant all on public.orders to service_role;
alter table public.orders enable row level security;
create policy "users read own orders" on public.orders for select to authenticated using (user_id = auth.uid());
create policy "admins manage orders" on public.orders for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger set_updated_at_orders before update on public.orders for each row execute function public.set_updated_at();

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text,
  product_name text not null,
  image text not null default '',
  size text not null default '',
  color text not null default '',
  unit_price numeric not null default 0,
  quantity int not null default 1
);
grant select, insert, update, delete on public.order_items to authenticated;
grant all on public.order_items to service_role;
alter table public.order_items enable row level security;
create policy "users read own order items" on public.order_items for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));
create policy "admins manage order items" on public.order_items for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null,
  note text not null default '',
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.order_events to authenticated;
grant all on public.order_events to service_role;
alter table public.order_events enable row level security;
create policy "users read own order events" on public.order_events for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));
create policy "admins manage order events" on public.order_events for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create index on public.order_items(order_id);
create index on public.order_events(order_id);
create index on public.orders(customer_phone);