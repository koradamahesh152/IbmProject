/*
# Cloud Service Model Advisor — Core Schema

## Purpose
Creates the full data model for a MERN-style "Cloud Service Model Advisor" application
running on Supabase (Postgres). The app lets authenticated users create cloud decision
scenarios, run a weighted scoring engine against IaaS/PaaS/SaaS, estimate costs and TCO,
generate reports, and maintain audit logs.

## Tables Created
1. `profiles` — application-level user profile (role, display name) linked 1:1 to auth.users
2. `scenarios` — cloud decision scenarios with 25+ requirement fields, owner-scoped
3. `analyses` — scoring results (IaaS/PaaS/SaaS scores, ranking, confidence, reasons)
4. `cost_estimates` — monthly/annual/3-year TCO estimates per model per analysis
5. `audit_logs` — user action audit trail, owner-scoped

## Security
- RLS enabled on every table
- profiles: each user reads/updates own profile; all authenticated can read profiles
- scenarios: owner-scoped CRUD (analyst sees own)
- analyses: owner-scoped
- cost_estimates: owner-scoped through analysis ownership
- audit_logs: owner-scoped SELECT

## Important Notes
1. `profiles.role` defaults to 'analyst'. Admin role is set via service role.
2. Owner columns default to `auth.uid()` so inserts omitting user_id still succeed.
3. All enums use CHECK constraints for data integrity.
4. Indexes added for frequently queried columns.
*/

-- ============================================================
-- 1. PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'analyst' CHECK (role IN ('admin', 'analyst')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "select_all_profiles_authenticated" ON profiles;
CREATE POLICY "select_all_profiles_authenticated" ON profiles FOR SELECT
  TO authenticated USING (true);

-- ============================================================
-- 2. SCENARIOS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  organization_name text NOT NULL,
  industry text NOT NULL DEFAULT 'Technology',
  description text DEFAULT '',
  application_type text NOT NULL DEFAULT 'Web Application' CHECK (application_type IN (
    'Web Application','Mobile App','API Service','E-Commerce Platform','Data Analytics',
    'CRM System','ERP System','Collaboration Tool','Learning Platform','Custom Infrastructure','Other'
  )),
  user_count integer NOT NULL DEFAULT 100 CHECK (user_count >= 1 AND user_count <= 10000000),
  traffic_level text NOT NULL DEFAULT 'Medium' CHECK (traffic_level IN ('Very Low','Low','Medium','High','Very High')),
  complexity text NOT NULL DEFAULT 'Medium' CHECK (complexity IN ('Very Low','Low','Medium','High','Very High')),
  customization text NOT NULL DEFAULT 'Medium' CHECK (customization IN ('Very Low','Low','Medium','High','Very High')),
  infrastructure_control text NOT NULL DEFAULT 'Medium' CHECK (infrastructure_control IN ('Very Low','Low','Medium','High','Very High')),
  scalability text NOT NULL DEFAULT 'Medium' CHECK (scalability IN ('Very Low','Low','Medium','High','Very High')),
  performance text NOT NULL DEFAULT 'Medium' CHECK (performance IN ('Very Low','Low','Medium','High','Very High')),
  availability text NOT NULL DEFAULT 'Medium' CHECK (availability IN ('Very Low','Low','Medium','High','Very High')),
  security text NOT NULL DEFAULT 'Medium' CHECK (security IN ('Very Low','Low','Medium','High','Very High')),
  integration text NOT NULL DEFAULT 'Medium' CHECK (integration IN ('Very Low','Low','Medium','High','Very High')),
  technical_expertise text NOT NULL DEFAULT 'Medium' CHECK (technical_expertise IN ('Very Low','Low','Medium','High','Very High')),
  management_preference text NOT NULL DEFAULT 'Medium' CHECK (management_preference IN ('Very Low','Low','Medium','High','Very High')),
  maintenance_tolerance text NOT NULL DEFAULT 'Medium' CHECK (maintenance_tolerance IN ('Very Low','Low','Medium','High','Very High')),
  deployment_speed text NOT NULL DEFAULT 'Medium' CHECK (deployment_speed IN ('Very Low','Low','Medium','High','Very High')),
  budget text NOT NULL DEFAULT 'Medium' CHECK (budget IN ('Very Low','Low','Medium','High','Very High')),
  cost_sensitivity text NOT NULL DEFAULT 'Medium' CHECK (cost_sensitivity IN ('Very Low','Low','Medium','High','Very High')),
  usage_pattern text NOT NULL DEFAULT 'Steady' CHECK (usage_pattern IN ('Steady','Variable','Predictable','Seasonal','Spiky')),
  pricing_preference text NOT NULL DEFAULT 'Pay-as-you-go' CHECK (pricing_preference IN ('Pay-as-you-go','Reserved','Subscription','Hybrid')),
  time_to_market text NOT NULL DEFAULT 'Medium' CHECK (time_to_market IN ('Very Low','Low','Medium','High','Very High')),
  flexibility text NOT NULL DEFAULT 'Medium' CHECK (flexibility IN ('Very Low','Low','Medium','High','Very High')),
  vendor_lockin_tolerance text NOT NULL DEFAULT 'Medium' CHECK (vendor_lockin_tolerance IN ('Very Low','Low','Medium','High','Very High')),
  created_by uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_scenarios_created_by ON scenarios(created_by);
CREATE INDEX IF NOT EXISTS idx_scenarios_created_at ON scenarios(created_at DESC);

DROP POLICY IF EXISTS "select_own_scenarios" ON scenarios;
CREATE POLICY "select_own_scenarios" ON scenarios FOR SELECT
  TO authenticated USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "insert_own_scenarios" ON scenarios;
CREATE POLICY "insert_own_scenarios" ON scenarios FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "update_own_scenarios" ON scenarios;
CREATE POLICY "update_own_scenarios" ON scenarios FOR UPDATE
  TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "delete_own_scenarios" ON scenarios;
CREATE POLICY "delete_own_scenarios" ON scenarios FOR DELETE
  TO authenticated USING (auth.uid() = created_by);

-- ============================================================
-- 3. ANALYSES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id uuid NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  recommended_model text NOT NULL CHECK (recommended_model IN ('iaas','paas','saas')),
  iaas_score numeric NOT NULL DEFAULT 0,
  paas_score numeric NOT NULL DEFAULT 0,
  saas_score numeric NOT NULL DEFAULT 0,
  ranking text[] NOT NULL DEFAULT '{}',
  confidence text NOT NULL DEFAULT 'Moderate' CHECK (confidence IN ('High','Moderate','Low')),
  confidence_difference numeric NOT NULL DEFAULT 0,
  reasons jsonb NOT NULL DEFAULT '[]',
  advantages jsonb NOT NULL DEFAULT '[]',
  tradeoffs jsonb NOT NULL DEFAULT '[]',
  factor_scores jsonb NOT NULL DEFAULT '[]',
  created_by uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_analyses_scenario_id ON analyses(scenario_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_by ON analyses(created_by);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at DESC);

DROP POLICY IF EXISTS "select_own_analyses" ON analyses;
CREATE POLICY "select_own_analyses" ON analyses FOR SELECT
  TO authenticated USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "insert_own_analyses" ON analyses;
CREATE POLICY "insert_own_analyses" ON analyses FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "delete_own_analyses" ON analyses;
CREATE POLICY "delete_own_analyses" ON analyses FOR DELETE
  TO authenticated USING (auth.uid() = created_by);

-- ============================================================
-- 4. COST_ESTIMATES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS cost_estimates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id uuid NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  model text NOT NULL CHECK (model IN ('iaas','paas','saas')),
  monthly_cost numeric NOT NULL DEFAULT 0,
  annual_cost numeric NOT NULL DEFAULT 0,
  three_year_tco numeric NOT NULL DEFAULT 0,
  initial_cost numeric NOT NULL DEFAULT 0,
  assumptions jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE cost_estimates ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_cost_estimates_analysis_id ON cost_estimates(analysis_id);

DROP POLICY IF EXISTS "select_own_cost_estimates" ON cost_estimates;
CREATE POLICY "select_own_cost_estimates" ON cost_estimates FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM analyses WHERE analyses.id = cost_estimates.analysis_id AND analyses.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_cost_estimates" ON cost_estimates;
CREATE POLICY "insert_own_cost_estimates" ON cost_estimates FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM analyses WHERE analyses.id = cost_estimates.analysis_id AND analyses.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "delete_own_cost_estimates" ON cost_estimates;
CREATE POLICY "delete_own_cost_estimates" ON cost_estimates FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM analyses WHERE analyses.id = cost_estimates.analysis_id AND analyses.created_by = auth.uid())
  );

-- ============================================================
-- 5. AUDIT_LOGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email text,
  action text NOT NULL CHECK (action IN (
    'login','register','create_scenario','update_scenario','delete_scenario',
    'run_analysis','generate_report','user_update','user_delete'
  )),
  entity text NOT NULL DEFAULT '',
  entity_id text DEFAULT '',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

DROP POLICY IF EXISTS "select_own_audit_logs" ON audit_logs;
CREATE POLICY "select_own_audit_logs" ON audit_logs FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_audit_logs" ON audit_logs;
CREATE POLICY "insert_own_audit_logs" ON audit_logs FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 6. HELPER: updated_at trigger function
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language plpgsql;

DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON profiles;
CREATE TRIGGER trigger_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_scenarios_updated_at ON scenarios;
CREATE TRIGGER trigger_scenarios_updated_at BEFORE UPDATE ON scenarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 7. HELPER: auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ language plpgsql security definer;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();