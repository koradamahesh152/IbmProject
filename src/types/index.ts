// ============================================================
// Cloud Service Model Advisor — Type Definitions
// ============================================================

export type UserRole = 'admin' | 'analyst';

export type CloudModel = 'iaas' | 'paas' | 'saas';

export type LevelValue = 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';

export type UsagePattern = 'Steady' | 'Variable' | 'Predictable' | 'Seasonal' | 'Spiky';

export type PricingPreference = 'Pay-as-you-go' | 'Reserved' | 'Subscription' | 'Hybrid';

export type ConfidenceLevel = 'High' | 'Moderate' | 'Low';

export type ApplicationType =
  | 'Web Application'
  | 'Mobile App'
  | 'API Service'
  | 'E-Commerce Platform'
  | 'Data Analytics'
  | 'CRM System'
  | 'ERP System'
  | 'Collaboration Tool'
  | 'Learning Platform'
  | 'Custom Infrastructure'
  | 'Other';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Scenario {
  id: string;
  name: string;
  organization_name: string;
  industry: string;
  description: string;
  application_type: ApplicationType;
  user_count: number;
  traffic_level: LevelValue;
  complexity: LevelValue;
  customization: LevelValue;
  infrastructure_control: LevelValue;
  scalability: LevelValue;
  performance: LevelValue;
  availability: LevelValue;
  security: LevelValue;
  integration: LevelValue;
  technical_expertise: LevelValue;
  management_preference: LevelValue;
  maintenance_tolerance: LevelValue;
  deployment_speed: LevelValue;
  budget: LevelValue;
  cost_sensitivity: LevelValue;
  usage_pattern: UsagePattern;
  pricing_preference: PricingPreference;
  time_to_market: LevelValue;
  flexibility: LevelValue;
  vendor_lockin_tolerance: LevelValue;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ScenarioInput {
  name: string;
  organization_name: string;
  industry: string;
  description: string;
  application_type: ApplicationType;
  user_count: number;
  traffic_level: LevelValue;
  complexity: LevelValue;
  customization: LevelValue;
  infrastructure_control: LevelValue;
  scalability: LevelValue;
  performance: LevelValue;
  availability: LevelValue;
  security: LevelValue;
  integration: LevelValue;
  technical_expertise: LevelValue;
  management_preference: LevelValue;
  maintenance_tolerance: LevelValue;
  deployment_speed: LevelValue;
  budget: LevelValue;
  cost_sensitivity: LevelValue;
  usage_pattern: UsagePattern;
  pricing_preference: PricingPreference;
  time_to_market: LevelValue;
  flexibility: LevelValue;
  vendor_lockin_tolerance: LevelValue;
}

export interface FactorScore {
  factor: string;
  category: string;
  weight: number;
  iaasScore: number;
  paasScore: number;
  saasScore: number;
}

export interface Analysis {
  id: string;
  scenario_id: string;
  recommended_model: CloudModel;
  iaas_score: number;
  paas_score: number;
  saas_score: number;
  ranking: CloudModel[];
  confidence: ConfidenceLevel;
  confidence_difference: number;
  reasons: string[];
  advantages: string[];
  tradeoffs: string[];
  factor_scores: FactorScore[];
  created_by: string;
  created_at: string;
}

export interface CostEstimate {
  id: string;
  analysis_id: string;
  model: CloudModel;
  monthly_cost: number;
  annual_cost: number;
  three_year_tco: number;
  initial_cost: number;
  assumptions: string[];
  created_at: string;
}

export interface AnalysisResult {
  analysis: Analysis;
  scenario: Scenario;
  costEstimates: CostEstimate[];
}

export interface DashboardStats {
  totalScenarios: number;
  iaasRecommendations: number;
  paasRecommendations: number;
  saasRecommendations: number;
  averageScore: number;
  averageMonthlyCost: number;
  recentAnalyses: Array<{
    id: string;
    scenario_name: string;
    recommended_model: CloudModel;
    top_score: number;
    created_at: string;
  }>;
  modelDistribution: Array<{ model: string; count: number }>;
  costComparison: Array<{ model: string; monthly: number; annual: number; tco: number }>;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_email: string;
  action: string;
  entity: string;
  entity_id: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface DecisionResult {
  iaasScore: number;
  paasScore: number;
  saasScore: number;
  ranking: CloudModel[];
  recommendedModel: CloudModel;
  confidence: ConfidenceLevel;
  confidenceDifference: number;
  factorScores: FactorScore[];
}

export interface CostResult {
  model: CloudModel;
  monthlyCost: number;
  annualCost: number;
  threeYearTCO: number;
  initialCost: number;
  assumptions: string[];
}

export interface ExplanationResult {
  reasons: string[];
  advantages: string[];
  tradeoffs: string[];
}
