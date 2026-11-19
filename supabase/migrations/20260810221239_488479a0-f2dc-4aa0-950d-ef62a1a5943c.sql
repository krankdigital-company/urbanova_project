
create or replace function public.is_staff(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role in ('admin','manager','staff'))
$$;

create or replace function public.is_manager(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role in ('admin','manager'))
$$;

-- PAGES
create table public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text not null default '',
  hero_image text not null default '',
  blocks jsonb not null default '[]'::jsonb,
  seo_title text not null default '',
  seo_description text not null default '',
  show_in_header boolean not null default false,
  show_in_footer boolean not null default false,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.pages to anon;
grant select, insert, update, delete on public.pages to authenticated;
grant all on public.pages to service_role;
alter table public.pages enable row level security;
create policy "public read pages" on public.pages for select using (true);
create policy "managers manage pages" on public.pages for all to authenticated
  using (public.is_manager(auth.uid())) with check (public.is_manager(auth.uid()));
create trigger set_updated_at_pages before update on public.pages for each row execute function public.set_updated_at();

-- MENU ITEMS
create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  location text not null default 'header',
  group_label text not null default '',
  label text not null,
  href text not null default '/',
  parent_id uuid references public.menu_items(id) on delete cascade,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);
grant select on public.menu_items to anon;
grant select, insert, update, delete on public.menu_items to authenticated;
grant all on public.menu_items to service_role;
alter table public.menu_items enable row level security;
create policy "public read menu_items" on public.menu_items for select using (true);
create policy "managers manage menu_items" on public.menu_items for all to authenticated
  using (public.is_manager(auth.uid())) with check (public.is_manager(auth.uid()));
create trigger set_updated_at_menu_items before update on public.menu_items for each row execute function public.set_updated_at();

-- SOCIAL LINKS
create table public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null default '',
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);
grant select on public.social_links to anon;
grant select, insert, update, delete on public.social_links to authenticated;
grant all on public.social_links to service_role;
alter table public.social_links enable row level security;
create policy "public read social_links" on public.social_links for select using (true);
create policy "managers manage social_links" on public.social_links for all to authenticated
  using (public.is_manager(auth.uid())) with check (public.is_manager(auth.uid()));
create trigger set_updated_at_social_links before update on public.social_links for each row execute function public.set_updated_at();

-- SHOP LOCATIONS
create table public.shop_locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null default '',
  city text not null default '',
  phone text not null default '',
  hours text not null default '',
  map_url text not null default '',
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);
grant select on public.shop_locations to anon;
grant select, insert, update, delete on public.shop_locations to authenticated;
grant all on public.shop_locations to service_role;
alter table public.shop_locations enable row level security;
create policy "public read shop_locations" on public.shop_locations for select using (true);
create policy "managers manage shop_locations" on public.shop_locations for all to authenticated
  using (public.is_manager(auth.uid())) with check (public.is_manager(auth.uid()));
create trigger set_updated_at_shop_locations before update on public.shop_locations for each row execute function public.set_updated_at();

-- DISCOUNTS
create table public.discounts (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text not null default '',
  discount_type text not null default 'percent',
  value numeric not null default 0,
  min_order numeric not null default 0,
  max_discount numeric,
  usage_limit integer,
  per_customer_limit integer,
  used_count integer not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.discounts to authenticated;
grant all on public.discounts to service_role;
alter table public.discounts enable row level security;
create policy "managers manage discounts" on public.discounts for all to authenticated
  using (public.is_manager(auth.uid())) with check (public.is_manager(auth.uid()));
create trigger set_updated_at_discounts before update on public.discounts for each row execute function public.set_updated_at();

create table public.discount_redemptions (
  id uuid primary key default gen_random_uuid(),
  discount_id uuid not null references public.discounts(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  user_id uuid,
  phone text not null default '',
  amount numeric not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.discount_redemptions to authenticated;
grant all on public.discount_redemptions to service_role;
alter table public.discount_redemptions enable row level security;
create policy "managers read redemptions" on public.discount_redemptions for select to authenticated
  using (public.is_manager(auth.uid()));

-- VARIANTS / STOCK
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id) on delete cascade,
  size text not null default '',
  color text not null default '',
  sku text not null default '',
  stock integer not null default 0,
  low_stock_threshold integer not null default 3,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index product_variants_product_idx on public.product_variants(product_id);
grant select on public.product_variants to anon;
grant select, insert, update, delete on public.product_variants to authenticated;
grant all on public.product_variants to service_role;
alter table public.product_variants enable row level security;
create policy "public read product_variants" on public.product_variants for select using (true);
create policy "managers manage product_variants" on public.product_variants for all to authenticated
  using (public.is_manager(auth.uid())) with check (public.is_manager(auth.uid()));
create trigger set_updated_at_product_variants before update on public.product_variants for each row execute function public.set_updated_at();

create table public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid references public.product_variants(id) on delete set null,
  product_id text,
  delta integer not null default 0,
  reason text not null default 'adjustment',
  note text not null default '',
  created_by uuid,
  created_at timestamptz not null default now()
);
grant select, insert on public.stock_movements to authenticated;
grant all on public.stock_movements to service_role;
alter table public.stock_movements enable row level security;
create policy "staff read stock_movements" on public.stock_movements for select to authenticated
  using (public.is_staff(auth.uid()));
create policy "managers write stock_movements" on public.stock_movements for insert to authenticated
  with check (public.is_manager(auth.uid()));

-- TEAM
create table public.staff (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  full_name text not null default '',
  email text not null,
  phone text not null default '',
  role app_role not null default 'staff',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index staff_email_idx on public.staff(lower(email));
grant select, insert, update, delete on public.staff to authenticated;
grant all on public.staff to service_role;
alter table public.staff enable row level security;
create policy "admins manage staff" on public.staff for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "staff read own record" on public.staff for select to authenticated using (user_id = auth.uid());
create trigger set_updated_at_staff before update on public.staff for each row execute function public.set_updated_at();

-- PAYMENT METHODS
create table public.payment_methods (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  description text not null default '',
  instructions text not null default '',
  account_number text not null default '',
  is_enabled boolean not null default true,
  requires_txn_id boolean not null default false,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);
grant select on public.payment_methods to anon;
grant select, insert, update, delete on public.payment_methods to authenticated;
grant all on public.payment_methods to service_role;
alter table public.payment_methods enable row level security;
create policy "public read payment_methods" on public.payment_methods for select using (true);
create policy "managers manage payment_methods" on public.payment_methods for all to authenticated
  using (public.is_manager(auth.uid())) with check (public.is_manager(auth.uid()));
create trigger set_updated_at_payment_methods before update on public.payment_methods for each row execute function public.set_updated_at();

-- DELIVERY ZONES
create table public.delivery_zones (
  id uuid primary key default gen_random_uuid(),
  district text not null,
  area text not null default '',
  charge numeric not null default 0,
  free_threshold numeric,
  eta text not null default '',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);
grant select on public.delivery_zones to anon;
grant select, insert, update, delete on public.delivery_zones to authenticated;
grant all on public.delivery_zones to service_role;
alter table public.delivery_zones enable row level security;
create policy "public read delivery_zones" on public.delivery_zones for select using (true);
create policy "managers manage delivery_zones" on public.delivery_zones for all to authenticated
  using (public.is_manager(auth.uid())) with check (public.is_manager(auth.uid()));
create trigger set_updated_at_delivery_zones before update on public.delivery_zones for each row execute function public.set_updated_at();

-- ORDER EXTENSIONS
alter table public.orders
  add column if not exists invoice_number text,
  add column if not exists channel text not null default 'online',
  add column if not exists discount_code text not null default '',
  add column if not exists discount_amount numeric not null default 0,
  add column if not exists payment_method text not null default 'cod',
  add column if not exists payment_status text not null default 'unpaid',
  add column if not exists payment_txn_id text not null default '',
  add column if not exists district text not null default '',
  add column if not exists internal_notes text not null default '';

alter table public.order_items
  add column if not exists sku text not null default '',
  add column if not exists variant_id uuid;

create policy "managers manage products v2" on public.products for all to authenticated
  using (public.is_manager(auth.uid())) with check (public.is_manager(auth.uid()));

-- SEED
insert into public.payment_methods (key, label, description, instructions, is_enabled, requires_txn_id, sort_order) values
  ('cod','Cash on Delivery','Pay in cash when your order arrives.','Please keep the exact amount ready.',true,false,1),
  ('bkash','bKash','Send money to our bKash merchant number.','Send the total to 01XXXXXXXXX and enter the transaction ID.',false,true,2),
  ('nagad','Nagad','Send money via Nagad.','Send the total to 01XXXXXXXXX and enter the transaction ID.',false,true,3),
  ('card','Card / Online','Pay online with a card.','',false,false,4);

insert into public.delivery_zones (district, area, charge, eta, sort_order) values
  ('Dhaka','Inside Dhaka City',60,'1-2 days',1),
  ('Dhaka','Dhaka Suburbs',100,'2-3 days',2),
  ('Chattogram','',120,'2-4 days',3),
  ('Khulna','',120,'2-4 days',4),
  ('Rajshahi','',120,'2-4 days',5),
  ('Sylhet','',120,'2-4 days',6),
  ('Barishal','',130,'3-5 days',7),
  ('Rangpur','',130,'3-5 days',8),
  ('Mymensingh','',120,'2-4 days',9);

insert into public.pages (slug, title, subtitle, seo_title, seo_description, show_in_header, sort_order, blocks) values
  ('about','About Us','Circular fashion, engineered in Dhaka.','About Us — Urbanova','Learn about Urbanova''s circular fashion mission, materials and craft.',true,1,
   '[{"type":"paragraph","text":"Urbanova is a sustainable fashion house creating premium everyday essentials from recycled and regenerative materials."},{"type":"paragraph","text":"Every garment is traceable, low-impact and built to last."}]'::jsonb);

insert into public.menu_items (location, label, href, sort_order) values
  ('header','Shop','/shop',1),
  ('header','Collections','/collections',2),
  ('header','Lookbook','/lookbook',3),
  ('header','Sustainability','/sustainability',4),
  ('header','About Us','/p/about',5),
  ('header','Contact','/contact',6);

insert into public.menu_items (location, group_label, label, href, sort_order) values
  ('footer','Shop','All Products','/shop',1),
  ('footer','Shop','Collections','/collections',2),
  ('footer','Company','About Us','/p/about',3),
  ('footer','Company','Contact','/contact',4),
  ('footer','Support','Track Order','/track',5),
  ('footer','Support','My Account','/account',6);

insert into public.social_links (platform, url, sort_order) values
  ('Instagram','https://instagram.com',1),
  ('Facebook','https://facebook.com',2),
  ('TikTok','https://tiktok.com',3);
