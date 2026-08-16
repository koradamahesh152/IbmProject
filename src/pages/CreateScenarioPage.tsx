import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { createScenario } from '@/services/scenarioService';
import { runAnalysis } from '@/services/analysisService';
import { DEMO_SCENARIOS } from '@/config/demoScenarios';
import { PageHeader, Card, LoadingState } from '@/components/ui';
import type { ScenarioInput, LevelValue, ApplicationType, UsagePattern, PricingPreference } from '@/types';
import { ChevronRight, Sparkles, Loader2 } from 'lucide-react';

const LEVELS: LevelValue[] = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];
const APP_TYPES: ApplicationType[] = [
  'Web Application', 'Mobile App', 'API Service', 'E-Commerce Platform', 'Data Analytics',
  'CRM System', 'ERP System', 'Collaboration Tool', 'Learning Platform', 'Custom Infrastructure', 'Other',
];
const USAGE_PATTERNS: UsagePattern[] = ['Steady', 'Variable', 'Predictable', 'Seasonal', 'Spiky'];
const PRICING_PREFS: PricingPreference[] = ['Pay-as-you-go', 'Reserved', 'Subscription', 'Hybrid'];
const INDUSTRIES = ['Technology', 'E-Commerce', 'Finance', 'Healthcare', 'Education', 'Manufacturing', 'Retail', 'Sales', 'Infrastructure', 'Other'];

const DEFAULT_INPUT: ScenarioInput = {
  name: '', organization_name: '', industry: 'Technology', description: '',
  application_type: 'Web Application', user_count: 100,
  traffic_level: 'Medium', complexity: 'Medium', customization: 'Medium',
  infrastructure_control: 'Medium', scalability: 'Medium', performance: 'Medium',
  availability: 'Medium', security: 'Medium', integration: 'Medium',
  technical_expertise: 'Medium', management_preference: 'Medium',
  maintenance_tolerance: 'Medium', deployment_speed: 'Medium',
  budget: 'Medium', cost_sensitivity: 'Medium', usage_pattern: 'Steady',
  pricing_preference: 'Pay-as-you-go', time_to_market: 'Medium',
  flexibility: 'Medium', vendor_lockin_tolerance: 'Medium',
};

export function CreateScenarioPage() {
  const navigate = useNavigate();
  const [input, setInput] = useState<ScenarioInput>(DEFAULT_INPUT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    { title: 'Basic Information', icon: '📋' },
    { title: 'Application', icon: '🖥️' },
    { title: 'Technical', icon: '⚙️' },
    { title: 'Operational', icon: '🔧' },
    { title: 'Financial', icon: '💰' },
    { title: 'Business', icon: '🏢' },
  ];

  function update<K extends keyof ScenarioInput>(key: K, value: ScenarioInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: scenario, error: createError } = await createScenario(input);
    if (createError || !scenario) {
      setError(createError || 'Failed to create scenario');
      setLoading(false);
      return;
    }

    // Auto-run analysis
    const { error: analysisError } = await runAnalysis(scenario);
    if (analysisError) {
      setError(`Scenario created, but analysis failed: ${analysisError}`);
      setLoading(false);
      return;
    }

    navigate(`/scenarios/${scenario.id}/results`);
  }

  function loadDemo(index: number) {
    setInput({ ...DEMO_SCENARIOS[index] });
  }

  return (
    <DashboardLayout>
      <PageHeader title="Create Decision Scenario" subtitle="Define your cloud requirements — the engine scores IaaS, PaaS, and SaaS automatically" />

      {/* Demo scenario loader */}
      <Card className="p-4 mb-6 bg-sky-50 border-sky-200">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-sky-900 mb-2">Quick start with a demo scenario:</p>
            <div className="flex flex-wrap gap-2">
              {DEMO_SCENARIOS.map((demo, i) => (
                <button
                  key={i}
                  onClick={() => loadDemo(i)}
                  className="text-xs bg-white border border-sky-200 text-sky-700 px-3 py-1.5 rounded-lg hover:bg-sky-100 transition-colors"
                >
                  {demo.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
      )}

      {/* Section tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {sections.map((s, i) => (
          <button
            key={i}
            onClick={() => setActiveSection(i)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSection === i ? 'bg-slate-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>{s.icon}</span> {s.title}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6">
          {/* Section 0: Basic Info */}
          {activeSection === 0 && (
            <div className="space-y-4">
              <Field label="Scenario Name" required>
                <input type="text" required value={input.name} onChange={(e) => update('name', e.target.value)} className={inputClass} placeholder="e.g. Custom E-Commerce Platform" />
              </Field>
              <Field label="Organization Name" required>
                <input type="text" required value={input.organization_name} onChange={(e) => update('organization_name', e.target.value)} className={inputClass} placeholder="e.g. ShopTech Solutions" />
              </Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Industry">
                  <select value={input.industry} onChange={(e) => update('industry', e.target.value)} className={inputClass}>
                    {INDUSTRIES.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
                  </select>
                </Field>
                <Field label="Application Type">
                  <select value={input.application_type} onChange={(e) => update('application_type', e.target.value as ApplicationType)} className={inputClass}>
                    {APP_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Description">
                <textarea value={input.description} onChange={(e) => update('description', e.target.value)} rows={3} className={inputClass} placeholder="Brief description of the scenario..." />
              </Field>
            </div>
          )}

          {/* Section 1: Application */}
          {activeSection === 1 && (
            <div className="space-y-4">
              <Field label={`Number of Users: ${input.user_count.toLocaleString()}`}>
                <input type="range" min={10} max={100000} step={10} value={input.user_count} onChange={(e) => update('user_count', Number(e.target.value))} className="w-full accent-slate-800" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>10</span><span>100,000+</span></div>
              </Field>
              <LevelField label="Traffic Level" value={input.traffic_level} onChange={(v) => update('traffic_level', v)} />
              <LevelField label="Application Complexity" value={input.complexity} onChange={(v) => update('complexity', v)} />
              <LevelField label="Customization Requirement" value={input.customization} onChange={(v) => update('customization', v)} />
            </div>
          )}

          {/* Section 2: Technical */}
          {activeSection === 2 && (
            <div className="space-y-4">
              <LevelField label="Infrastructure Control" value={input.infrastructure_control} onChange={(v) => update('infrastructure_control', v)} />
              <LevelField label="Scalability" value={input.scalability} onChange={(v) => update('scalability', v)} />
              <LevelField label="Performance" value={input.performance} onChange={(v) => update('performance', v)} />
              <LevelField label="Availability" value={input.availability} onChange={(v) => update('availability', v)} />
              <LevelField label="Security" value={input.security} onChange={(v) => update('security', v)} />
              <LevelField label="Integration" value={input.integration} onChange={(v) => update('integration', v)} />
            </div>
          )}

          {/* Section 3: Operational */}
          {activeSection === 3 && (
            <div className="space-y-4">
              <LevelField label="Technical Team Expertise" value={input.technical_expertise} onChange={(v) => update('technical_expertise', v)} />
              <LevelField label="Infrastructure Management Preference" value={input.management_preference} onChange={(v) => update('management_preference', v)} hint="High = want to manage infrastructure yourself; Low = want provider to manage it" />
              <LevelField label="Maintenance Tolerance" value={input.maintenance_tolerance} onChange={(v) => update('maintenance_tolerance', v)} />
              <LevelField label="Deployment Speed" value={input.deployment_speed} onChange={(v) => update('deployment_speed', v)} />
            </div>
          )}

          {/* Section 4: Financial */}
          {activeSection === 4 && (
            <div className="space-y-4">
              <LevelField label="Budget" value={input.budget} onChange={(v) => update('budget', v)} />
              <LevelField label="Cost Sensitivity" value={input.cost_sensitivity} onChange={(v) => update('cost_sensitivity', v)} />
              <Field label="Usage Pattern">
                <select value={input.usage_pattern} onChange={(e) => update('usage_pattern', e.target.value as UsagePattern)} className={inputClass}>
                  {USAGE_PATTERNS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </Field>
              <Field label="Pricing Preference">
                <select value={input.pricing_preference} onChange={(e) => update('pricing_preference', e.target.value as PricingPreference)} className={inputClass}>
                  {PRICING_PREFS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </Field>
            </div>
          )}

          {/* Section 5: Business */}
          {activeSection === 5 && (
            <div className="space-y-4">
              <LevelField label="Time to Market" value={input.time_to_market} onChange={(v) => update('time_to_market', v)} />
              <LevelField label="Flexibility" value={input.flexibility} onChange={(v) => update('flexibility', v)} />
              <LevelField label="Vendor Lock-in Tolerance" value={input.vendor_lockin_tolerance} onChange={(v) => update('vendor_lockin_tolerance', v)} hint="High = comfortable with vendor lock-in; Low = want portability" />
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
              disabled={activeSection === 0}
              className="px-4 py-2 text-sm font-medium text-gray-600 disabled:opacity-40"
            >
              ← Previous
            </button>
            {activeSection < 5 ? (
              <button
                type="button"
                onClick={() => setActiveSection(Math.min(5, activeSection + 1))}
                className="inline-flex items-center gap-1 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating & Analyzing...</> : 'Create & Run Analysis'}
              </button>
            )}
          </div>
        </Card>
      </form>

      {loading && <LoadingState message="Running decision engine and cost engine..." />}
    </DashboardLayout>
  );
}

const inputClass = 'w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-sm';

function Field({ label, children, required, hint }: { label: string; children: React.ReactNode; required?: boolean; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function LevelField({ label, value, onChange, hint }: { label: string; value: LevelValue; onChange: (v: LevelValue) => void; hint?: string }) {
  return (
    <Field label={label} hint={hint}>
      <div className="flex gap-2">
        {LEVELS.map((lvl) => (
          <button
            key={lvl}
            type="button"
            onClick={() => onChange(lvl)}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all border ${
              value === lvl
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>
    </Field>
  );
}
