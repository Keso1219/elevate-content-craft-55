-- Enable Row Level Security on all tables and create appropriate policies
-- This fixes the RLS Disabled in Public security errors

-- Enable RLS on facebook_posts table
ALTER TABLE public.facebook_posts ENABLE ROW LEVEL SECURITY;

-- Enable RLS on instagram_posts table  
ALTER TABLE public.instagram_posts ENABLE ROW LEVEL SECURITY;

-- Enable RLS on linkedin_posts table
ALTER TABLE public.linkedin_posts ENABLE ROW LEVEL SECURITY;

-- Enable RLS on fb_guide_docs table
ALTER TABLE public.fb_guide_docs ENABLE ROW LEVEL SECURITY;

-- Enable RLS on ig_guide_docs table
ALTER TABLE public.ig_guide_docs ENABLE ROW LEVEL SECURITY;

-- Enable RLS on li_guide_docs table
ALTER TABLE public.li_guide_docs ENABLE ROW LEVEL SECURITY;

-- Enable RLS on reddit_docs table
ALTER TABLE public.reddit_docs ENABLE ROW LEVEL SECURITY;

-- Enable RLS on news_documents table
ALTER TABLE public.news_documents ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to content tables
-- These tables contain social media content and guides that should be publicly readable

-- Facebook Posts - Public read access
CREATE POLICY "Allow public read access to facebook posts" ON public.facebook_posts
FOR SELECT USING (true);

-- Instagram Posts - Public read access  
CREATE POLICY "Allow public read access to instagram posts" ON public.instagram_posts
FOR SELECT USING (true);

-- LinkedIn Posts - Public read access
CREATE POLICY "Allow public read access to linkedin posts" ON public.linkedin_posts
FOR SELECT USING (true);

-- Facebook Guide Docs - Public read access
CREATE POLICY "Allow public read access to facebook guide docs" ON public.fb_guide_docs
FOR SELECT USING (true);

-- Instagram Guide Docs - Public read access
CREATE POLICY "Allow public read access to instagram guide docs" ON public.ig_guide_docs
FOR SELECT USING (true);

-- LinkedIn Guide Docs - Public read access  
CREATE POLICY "Allow public read access to linkedin guide docs" ON public.li_guide_docs
FOR SELECT USING (true);

-- Reddit Docs - Public read access
CREATE POLICY "Allow public read access to reddit docs" ON public.reddit_docs
FOR SELECT USING (true);

-- News Documents - Public read access
CREATE POLICY "Allow public read access to news documents" ON public.news_documents
FOR SELECT USING (true);

-- Restrict write operations to authenticated users only (for future use)
-- You can modify these policies later when you implement user authentication

-- Facebook Posts - Write restrictions
CREATE POLICY "Restrict facebook posts modifications" ON public.facebook_posts
FOR ALL USING (false) WITH CHECK (false);

-- Instagram Posts - Write restrictions
CREATE POLICY "Restrict instagram posts modifications" ON public.instagram_posts  
FOR ALL USING (false) WITH CHECK (false);

-- LinkedIn Posts - Write restrictions
CREATE POLICY "Restrict linkedin posts modifications" ON public.linkedin_posts
FOR ALL USING (false) WITH CHECK (false);

-- Facebook Guide Docs - Write restrictions
CREATE POLICY "Restrict facebook guide docs modifications" ON public.fb_guide_docs
FOR ALL USING (false) WITH CHECK (false);

-- Instagram Guide Docs - Write restrictions  
CREATE POLICY "Restrict instagram guide docs modifications" ON public.ig_guide_docs
FOR ALL USING (false) WITH CHECK (false);

-- LinkedIn Guide Docs - Write restrictions
CREATE POLICY "Restrict linkedin guide docs modifications" ON public.li_guide_docs
FOR ALL USING (false) WITH CHECK (false);

-- Reddit Docs - Write restrictions
CREATE POLICY "Restrict reddit docs modifications" ON public.reddit_docs
FOR ALL USING (false) WITH CHECK (false);

-- News Documents - Write restrictions
CREATE POLICY "Restrict news documents modifications" ON public.news_documents
FOR ALL USING (false) WITH CHECK (false);