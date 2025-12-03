-- Create competitions table
CREATE TABLE IF NOT EXISTS public.competitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'active', 'completed', 'cancelled'
  class_year TEXT NOT NULL DEFAULT 'all', -- 'year_6', 'year_9', 'all'
  created_by UUID REFERENCES public.admins(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_competitions_status ON public.competitions(status);
CREATE INDEX idx_competitions_dates ON public.competitions(start_date, end_date);

-- Trigger for updated_at
CREATE TRIGGER set_competitions_updated_at
  BEFORE UPDATE ON public.competitions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS Policies

-- Everyone can view active competitions (for public display)
CREATE POLICY "Public can view active competitions"
  ON public.competitions FOR SELECT
  USING (status = 'active');

-- Admins can view all competitions
CREATE POLICY "Admins can view all competitions"
  ON public.competitions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
        AND is_active = TRUE
    )
  );

-- Admins can insert competitions
CREATE POLICY "Admins can insert competitions"
  ON public.competitions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
        AND is_active = TRUE
    )
  );

-- Admins can update competitions
CREATE POLICY "Admins can update competitions"
  ON public.competitions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
        AND is_active = TRUE
    )
  );

-- Admins can delete competitions
CREATE POLICY "Admins can delete competitions"
  ON public.competitions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
        AND is_active = TRUE
    )
  );
