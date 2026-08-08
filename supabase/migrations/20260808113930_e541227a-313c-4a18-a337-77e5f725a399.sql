CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  headline text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  skills text[] NOT NULL DEFAULT '{}'::text[],
  avatar_path text,
  resume_path text,
  resume_name text,
  resume_size integer,
  resume_updated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE POLICY "Users can read own files" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id IN ('resumes','avatars') AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can upload own files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('resumes','avatars') AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update own files" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id IN ('resumes','avatars') AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id IN ('resumes','avatars') AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own files" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id IN ('resumes','avatars') AND auth.uid()::text = (storage.foldername(name))[1]);