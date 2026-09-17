-- ========================================================
-- SUPABASE SAFE MIGRATION SCRIPT (DATA PRESERVING)
-- Copy & Run this code in Supabase SQL Editor
-- Your existing data, orders, products & users will NOT be deleted!
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------
-- 1. PROFILES TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    role TEXT DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles select" ON public.profiles;
CREATE POLICY "Public profiles select" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "User profiles insert" ON public.profiles;
CREATE POLICY "User profiles insert" ON public.profiles FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "User profiles update" ON public.profiles;
CREATE POLICY "User profiles update" ON public.profiles FOR UPDATE USING (auth.uid() = id OR true);


-- --------------------------------------------------------
-- 2. USER ADDRESSES TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    street TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public user_addresses access" ON public.user_addresses;
CREATE POLICY "Allow public user_addresses access" ON public.user_addresses FOR ALL USING (true) WITH CHECK (true);


-- --------------------------------------------------------
-- 3. PRODUCTS TABLE & SAFE COLUMN ADDITIONS
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT,
    price NUMERIC NOT NULL DEFAULT 0,
    original_price NUMERIC,
    description TEXT,
    image_url TEXT,
    additional_images JSONB DEFAULT '[]'::jsonb,
    benefits JSONB DEFAULT '[]'::jsonb,
    sizes JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Safely add missing columns to products without touching data
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS additional_images JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS benefits JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sizes JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public products read" ON public.products;
CREATE POLICY "Allow public products read" ON public.products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow full products write for admins/anon" ON public.products;
CREATE POLICY "Allow full products write for admins/anon" ON public.products FOR ALL USING (true) WITH CHECK (true);


-- --------------------------------------------------------
-- 4. ORDERS TABLE & SAFE COLUMN ADDITIONS (Shadowfax)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT,
    customer_phone TEXT,
    shipping_address JSONB,
    total_amount NUMERIC NOT NULL DEFAULT 0,
    status TEXT DEFAULT 'pending',
    tracking_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Safely add tracking_number column if missing
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_phone TEXT;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public orders access" ON public.orders;
CREATE POLICY "Allow public orders access" ON public.orders FOR ALL USING (true) WITH CHECK (true);


-- --------------------------------------------------------
-- 5. ORDER ITEMS TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    quantity INTEGER DEFAULT 1,
    price_at_time NUMERIC DEFAULT 0,
    selected_size JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public order_items access" ON public.order_items;
CREATE POLICY "Allow public order_items access" ON public.order_items FOR ALL USING (true) WITH CHECK (true);


-- --------------------------------------------------------
-- 6. COUPONS TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC NOT NULL DEFAULT 0,
    min_order_amount NUMERIC DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public coupons access" ON public.coupons;
CREATE POLICY "Allow public coupons access" ON public.coupons FOR ALL USING (true) WITH CHECK (true);


-- --------------------------------------------------------
-- 7. REVIEWS & FEEDBACK TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY DEFAULT ('rev-' || gen_random_uuid()::text),
    customer_name TEXT,
    customer_email TEXT,
    rating NUMERIC DEFAULT 5,
    comment TEXT,
    product_id TEXT,
    product_name TEXT,
    status TEXT DEFAULT 'approved',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public reviews access" ON public.reviews;
CREATE POLICY "Allow public reviews access" ON public.reviews FOR ALL USING (true) WITH CHECK (true);

-- ========================================================
-- SAFE MIGRATION COMPLETE - NO DATA WAS DROPPED OR DELETED
-- ========================================================
