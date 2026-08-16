// ============================================================
// Scoring Rules Configuration — Centralized Decision Rules
// ============================================================
// This file contains ALL the scoring rules for the decision engine.
// Each factor maps a requirement level (Very Low → Very High) to
// a score (1-5) for each cloud model (IaaS, PaaS, SaaS).
//
// 1 = Very unsuitable, 2 = Unsuitable, 3 = Neutral,
// 4 = Suitable, 5 = Very suitable
//
// To change the scoring behavior of the application, edit this file.
// Do NOT scatter hard-coded numbers throughout the application.
// ============================================================

import type { LevelValue, CloudModel } from '@/types';

export interface ModelScore {
  iaas: number;
  paas: number;
  saas: number;
}

export type FactorRule = Record<LevelValue, ModelScore>;

export const SCORING_RULES: Record<string, FactorRule> = {
  // ---- TECHNICAL FACTORS ----
  infrastructureControl: {
    'Very High': { iaas: 5, paas: 2, saas: 1 },
    High: { iaas: 5, paas: 3, saas: 1 },
    Medium: { iaas: 3, paas: 4, saas: 3 },
    Low: { iaas: 2, paas: 4, saas: 5 },
    'Very Low': { iaas: 1, paas: 3, saas: 5 },
  },
  customization: {
    'Very High': { iaas: 5, paas: 4, saas: 1 },
    High: { iaas: 5, paas: 4, saas: 2 },
    Medium: { iaas: 3, paas: 4, saas: 3 },
    Low: { iaas: 2, paas: 3, saas: 5 },
    'Very Low': { iaas: 1, paas: 2, saas: 5 },
  },
  scalability: {
    'Very High': { iaas: 5, paas: 5, saas: 3 },
    High: { iaas: 4, paas: 5, saas: 4 },
    Medium: { iaas: 3, paas: 4, saas: 4 },
    Low: { iaas: 3, paas: 3, saas: 4 },
    'Very Low': { iaas: 2, paas: 3, saas: 5 },
  },
  performance: {
    'Very High': { iaas: 5, paas: 4, saas: 2 },
    High: { iaas: 5, paas: 4, saas: 3 },
    Medium: { iaas: 3, paas: 4, saas: 4 },
    Low: { iaas: 3, paas: 3, saas: 4 },
    'Very Low': { iaas: 2, paas: 3, saas: 5 },
  },
  security: {
    'Very High': { iaas: 5, paas: 4, saas: 2 },
    High: { iaas: 5, paas: 4, saas: 3 },
    Medium: { iaas: 4, paas: 4, saas: 4 },
    Low: { iaas: 3, paas: 4, saas: 4 },
    'Very Low': { iaas: 3, paas: 4, saas: 5 },
  },
  integration: {
    'Very High': { iaas: 5, paas: 4, saas: 2 },
    High: { iaas: 4, paas: 5, saas: 3 },
    Medium: { iaas: 3, paas: 4, saas: 4 },
    Low: { iaas: 2, paas: 3, saas: 4 },
    'Very Low': { iaas: 2, paas: 3, saas: 5 },
  },

  // ---- OPERATIONAL FACTORS ----
  technicalExpertise: {
    'Very High': { iaas: 5, paas: 4, saas: 2 },
    High: { iaas: 5, paas: 4, saas: 3 },
    Medium: { iaas: 3, paas: 4, saas: 4 },
    Low: { iaas: 2, paas: 4, saas: 5 },
    'Very Low': { iaas: 1, paas: 3, saas: 5 },
  },
  managementPreference: {
    'Very High': { iaas: 5, paas: 3, saas: 1 },
    High: { iaas: 4, paas: 3, saas: 2 },
    Medium: { iaas: 3, paas: 4, saas: 3 },
    Low: { iaas: 2, paas: 4, saas: 5 },
    'Very Low': { iaas: 1, paas: 4, saas: 5 },
  },
  maintenanceTolerance: {
    'Very High': { iaas: 5, paas: 4, saas: 2 },
    High: { iaas: 5, paas: 4, saas: 3 },
    Medium: { iaas: 3, paas: 4, saas: 4 },
    Low: { iaas: 2, paas: 4, saas: 5 },
    'Very Low': { iaas: 1, paas: 3, saas: 5 },
  },
  deploymentSpeed: {
    'Very High': { iaas: 2, paas: 4, saas: 5 },
    High: { iaas: 2, paas: 4, saas: 5 },
    Medium: { iaas: 3, paas: 4, saas: 4 },
    Low: { iaas: 4, paas: 3, saas: 3 },
    'Very Low': { iaas: 5, paas: 3, saas: 2 },
  },

  // ---- FINANCIAL FACTORS ----
  budget: {
    'Very High': { iaas: 5, paas: 4, saas: 3 },
    High: { iaas: 4, paas: 4, saas: 4 },
    Medium: { iaas: 3, paas: 4, saas: 4 },
    Low: { iaas: 2, paas: 3, saas: 5 },
    'Very Low': { iaas: 1, paas: 3, saas: 5 },
  },
  costSensitivity: {
    'Very High': { iaas: 2, paas: 3, saas: 5 },
    High: { iaas: 3, paas: 3, saas: 5 },
    Medium: { iaas: 3, paas: 4, saas: 4 },
    Low: { iaas: 4, paas: 4, saas: 3 },
    'Very Low': { iaas: 5, paas: 4, saas: 2 },
  },

  // ---- BUSINESS FACTORS ----
  timeToMarket: {
    'Very High': { iaas: 1, paas: 4, saas: 5 },
    High: { iaas: 2, paas: 4, saas: 5 },
    Medium: { iaas: 3, paas: 4, saas: 4 },
    Low: { iaas: 4, paas: 3, saas: 3 },
    'Very Low': { iaas: 5, paas: 3, saas: 2 },
  },
  flexibility: {
    'Very High': { iaas: 5, paas: 4, saas: 2 },
    High: { iaas: 5, paas: 4, saas: 3 },
    Medium: { iaas: 4, paas: 4, saas: 4 },
    Low: { iaas: 3, paas: 3, saas: 4 },
    'Very Low': { iaas: 2, paas: 3, saas: 5 },
  },
  vendorLockInTolerance: {
    'Very High': { iaas: 5, paas: 4, saas: 2 },
    High: { iaas: 5, paas: 4, saas: 3 },
    Medium: { iaas: 4, paas: 4, saas: 4 },
    Low: { iaas: 3, paas: 3, saas: 4 },
    'Very Low': { iaas: 2, paas: 3, saas: 5 },
  },
};

// ============================================================
// Category Weights — Configurable
// ============================================================

export const CATEGORY_WEIGHTS = {
  technical: 0.40,
  operational: 0.25,
  financial: 0.20,
  business: 0.15,
};

// ============================================================
// Factor-to-Category Mapping
// ============================================================

export const FACTOR_CATEGORIES: Record<string, keyof typeof CATEGORY_WEIGHTS> = {
  infrastructureControl: 'technical',
  customization: 'technical',
  scalability: 'technical',
  performance: 'technical',
  security: 'technical',
  integration: 'technical',
  technicalExpertise: 'operational',
  managementPreference: 'operational',
  maintenanceTolerance: 'operational',
  deploymentSpeed: 'operational',
  budget: 'financial',
  costSensitivity: 'financial',
  timeToMarket: 'business',
  flexibility: 'business',
  vendorLockInTolerance: 'business',
};

// ============================================================
// Factor Display Names
// ============================================================

export const FACTOR_LABELS: Record<string, string> = {
  infrastructureControl: 'Infrastructure Control',
  customization: 'Customization Requirement',
  scalability: 'Scalability',
  performance: 'Performance',
  security: 'Security',
  integration: 'Integration',
  technicalExpertise: 'Technical Team Expertise',
  managementPreference: 'Infrastructure Management Preference',
  maintenanceTolerance: 'Maintenance Tolerance',
  deploymentSpeed: 'Deployment Speed',
  budget: 'Budget',
  costSensitivity: 'Cost Sensitivity',
  timeToMarket: 'Time to Market',
  flexibility: 'Flexibility',
  vendorLockInTolerance: 'Vendor Lock-in Tolerance',
};

// ============================================================
// Factor weights within categories (equal distribution)
// ============================================================

export const FACTOR_WEIGHTS: Record<string, number> = {
  // Technical (6 factors, equal weight)
  infrastructureControl: 1 / 6,
  customization: 1 / 6,
  scalability: 1 / 6,
  performance: 1 / 6,
  security: 1 / 6,
  integration: 1 / 6,
  // Operational (4 factors, equal weight)
  technicalExpertise: 1 / 4,
  managementPreference: 1 / 4,
  maintenanceTolerance: 1 / 4,
  deploymentSpeed: 1 / 4,
  // Financial (2 factors, equal weight)
  budget: 1 / 2,
  costSensitivity: 1 / 2,
  // Business (3 factors, equal weight)
  timeToMarket: 1 / 3,
  flexibility: 1 / 3,
  vendorLockInTolerance: 1 / 3,
};

// ============================================================
// Confidence Thresholds
// ============================================================

export const CONFIDENCE_THRESHOLDS = {
  high: 15,
  moderate: 8,
};

// ============================================================
// Model Display Info
// ============================================================

export const MODEL_INFO: Record<CloudModel, { name: string; fullName: string; color: string }> = {
  iaas: { name: 'IaaS', fullName: 'Infrastructure as a Service', color: '#0ea5e9' },
  paas: { name: 'PaaS', fullName: 'Platform as a Service', color: '#10b981' },
  saas: { name: 'SaaS', fullName: 'Software as a Service', color: '#f59e0b' },
};
