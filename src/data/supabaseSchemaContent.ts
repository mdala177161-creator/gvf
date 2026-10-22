export const FULL_SUPABASE_SCHEMA = `-- =====================================================================
-- Haque Graphy — Complete PostgreSQL Database Schema & Security Policies
-- Designed for Supabase Auth, Row Level Security (RLS), and Netlify Frontend
-- =====================================================================

-- 1. Profiles Table (Tracks user roles and designates administrator)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  username text,
  is_admin boolean default false,
  role text default 'customer',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Products Table (All Digital Assets: PLP, PSD, AI, EPS, ZIP, PNG, JPG, PDF)
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  title_bn text not null,
  description text,
  description_bn text,
  category text not null,
  category_name_en text,
  category_name_bn text,
  price numeric not null default 0,
  sale_price numeric,
  is_free boolean default false,
  is_published boolean default true,
  is_featured boolean default false,
  file_type text not null,
  file_size text default '50 MB',
  software_version text,
  color_mode text default 'CMYK',
  dimensions text default '3000 x 3000 px',
  dpi integer default 300,
  preview_image text not null,
  file_download_url text not null,
  download_count integer default 0,
  sales_count integer default 0,
  tags text[] default array[]::text[],
  features text[] default array[]::text[],
  features_bn text[] default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Orders Table (Records bKash, Nagad, and WhatsApp Orders with manual TrxID)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  whatsapp_number text,
  items jsonb not null,
  total_amount numeric not null default 0,
  discount_amount numeric default 0,
  applied_coupon text,
  payment_method text not null,
  sender_phone text,
  transaction_id text,
  customer_note text,
  status text not null default 'pending_verification',
  download_token text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  verified_at timestamp with time zone
);

-- 4. Site Settings & Branding Table
create table if not exists public.settings (
  id text primary key default 'main_settings',
  brand_name text not null default 'Haque Graphy',
  brand_name_bn text not null default 'হক গ্রাফি',
  tagline text default 'Tasteful Design & Flawless Print',
  tagline_bn text default 'রুচিশীল ডিজাইন ও নিখুঁত প্রিন্ট',
  bkash_number text default '01792-124279 (Personal / Send Money)',
  nagad_number text default '01792-124279 (Personal / Send Money)',
  whatsapp_number text default '+8801792124279',
  contact_email text default 'haquegraphydesign@gmail.com',
  studio_address text default 'Machum Bazar, Birshree, Zakiganj, Sylhet, Bangladesh',
  studio_address_bn text default 'মাছুম বাজার, বীরশ্রী, জকিগঞ্জ, সিলেট, বাংলাদেশ',
  banner_notice text,
  banner_notice_bn text,
  is_banner_active boolean default true,
  cloudinary_cloud_name text default 'c48ghki2',
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.settings enable row level security;

-- Security Definer Function to safely check if caller is an Administrator
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and (is_admin = true or role = 'admin')
  ) or (auth.jwt()->>'email' = 'admin@haquegraphy.com');
$$;

-- PROFILES POLICIES
create policy "Users can view own profile or admin can view all"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- PRODUCTS POLICIES
-- 1. Anyone (public) can view published products; Admin can view all
create policy "Public can view published products"
  on public.products for select
  using (is_published = true or public.is_admin());

-- 2. ONLY authorized Admin can Insert, Update, or Delete products
create policy "Admin can insert products"
  on public.products for insert
  with check (public.is_admin());

create policy "Admin can update products"
  on public.products for update
  using (public.is_admin());

create policy "Admin can delete products"
  on public.products for delete
  using (public.is_admin());

-- ORDERS POLICIES
-- 1. Public can create an order request
create policy "Public can insert orders"
  on public.orders for insert
  with check (true);

-- 2. Anyone can lookup order status by order number or admin can view all
create policy "Public can view orders"
  on public.orders for select
  using (true);

-- 3. ONLY Admin can verify/update or delete orders
create policy "Admin can update orders"
  on public.orders for update
  using (public.is_admin());

create policy "Admin can delete orders"
  on public.orders for delete
  using (public.is_admin());

-- SETTINGS POLICIES
create policy "Public can read settings"
  on public.settings for select
  using (true);

create policy "Admin can update settings"
  on public.settings for update
  using (public.is_admin());

-- =====================================================================
-- AUTOMATIC PROFILE TRIGGER ON SUPABASE AUTH SIGNUP
-- Automatically elevates 'admin@haquegraphy.com' to administrator!
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, username, is_admin, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    case when new.email = 'admin@haquegraphy.com' then true else false end,
    case when new.email = 'admin@haquegraphy.com' then 'admin' else 'customer' end
  )
  on conflict (id) do update set
    email = excluded.email,
    is_admin = case when excluded.email = 'admin@haquegraphy.com' then true else profiles.is_admin end;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Default main settings seed
insert into public.settings (id, brand_name, brand_name_bn, tagline, tagline_bn, bkash_number, nagad_number, whatsapp_number, contact_email, cloudinary_cloud_name)
values ('main_settings', 'Haque Graphy', 'হক গ্রাফি', 'Tasteful Design & Flawless Print', 'রুচিশীল ডিজাইন ও নিখুঁত প্রিন্ট', '01792-124279 (Personal / Send Money)', '01792-124279 (Personal / Send Money)', '+8801792124279', 'haquegraphydesign@gmail.com', 'c48ghki2')
on conflict (id) do nothing;
`;
