-- 1. Enable Row Level Security (RLS) on the table if it's not already switched on
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 2. Safely remove the existing policies so we can recreate them without errors
DROP POLICY IF EXISTS "Public users can view products" ON public.products;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

-- 3. Allow PUBLIC (Anonymous) Users to read the available products on the website
CREATE POLICY "Public users can view products" 
ON public.products 
FOR SELECT 
USING (true);

-- 4. Allow logged-in ADMIN users to insert, update, and manage products
CREATE POLICY "Admins can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update products" 
ON public.products 
FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete products" 
ON public.products 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- 5. Testimonials Table Setup
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    title TEXT,
    rating INTEGER DEFAULT 5,
    review TEXT,
    avatar_url TEXT
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view testimonials" ON public.testimonials;
CREATE POLICY "Public can view testimonials" ON public.testimonials FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage testimonials" ON public.testimonials;
CREATE POLICY "Admins can manage testimonials" ON public.testimonials FOR ALL USING (auth.role() = 'authenticated');
