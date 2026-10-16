CREATE TABLE public.members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  full_name text NOT NULL,
  email text, phone text, gender text, birthday date,
  status text NOT NULL DEFAULT 'active',
  joined_on date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  full_name text NOT NULL,
  email text, phone text, invited_by text, notes text,
  visit_date date NOT NULL DEFAULT current_date,
  follow_up_status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  member_id uuid REFERENCES public.members(id) ON DELETE SET NULL,
  donor_name text,
  category text NOT NULL DEFAULT 'tithe',
  method text NOT NULL DEFAULT 'cash',
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  given_on date NOT NULL DEFAULT current_date,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  description text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  spent_on date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now()
);
DO $$ DECLARE t text; BEGIN
FOREACH t IN ARRAY ARRAY['members','visitors','donations','expenses'] LOOP
  EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
  EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
  EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
  EXECUTE format('CREATE POLICY "own rows" ON public.%I FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)', t);
END LOOP; END $$;