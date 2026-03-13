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
