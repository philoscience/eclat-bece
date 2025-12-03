-- Create system_settings table
CREATE TABLE IF NOT EXISTS public.system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES public.admins(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Trigger for updated_at
CREATE TRIGGER set_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS Policies

-- Public can view certain settings (e.g., maintenance mode)
-- We'll control this via a specific list of public keys if needed, 
-- but for now let's say authenticated users can read all settings 
-- (or restrict to admins if they are sensitive).
-- Let's restrict to admins for now, and create a function for public access if needed.

CREATE POLICY "Admins can view all settings"
  ON public.system_settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
        AND is_active = TRUE
    )
  );

CREATE POLICY "Admins can update settings"
  ON public.system_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
        AND is_active = TRUE
    )
  );

-- Insert default settings
INSERT INTO public.system_settings (key, value, description)
VALUES 
  ('maintenance_mode', 'false'::jsonb, 'Enable to prevent non-admin access'),
  ('support_email', '"support@eclat.com"'::jsonb, 'Contact email for support'),
  ('allow_registrations', 'true'::jsonb, 'Allow new user registrations'),
  ('announcement_banner', 'null'::jsonb, 'Global announcement message');
