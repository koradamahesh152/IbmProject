import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { getScenarios } from '@/services/scenarioService';
import { Card, Badge, LoadingState, ErrorState, PageHeader, EmptyState } from '@/components/ui';
import type { Scenario } from '@/types';
import { Plus, ArrowRight, Building2, Calendar } from 'lucide-react';

export function ScenarioListPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    const { data, error } = await getScenarios();
    if (error) setError(error);
    else setScenarios(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  if (loading) return <DashboardLayout><LoadingState message="Loading scenarios..." /></DashboardLayout>;
  if (error) return <DashboardLayout><ErrorState message={error} onRetry={load} /></DashboardLayout>;

  return (
    <DashboardLayout>
      <PageHeader
        title="Scenarios"
        subtitle="Your cloud decision scenarios"
        action={
          <Link to="/scenarios/create" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> New Scenario
          </Link>
        }
      />

      {scenarios.length === 0 ? (
        <EmptyState
          title="No scenarios yet"
          message="Create your first cloud decision scenario to get IaaS, PaaS, and SaaS recommendations."
          action={
            <Link to="/scenarios/create" className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium">
              <Plus className="w-4 h-4" /> Create Scenario
            </Link>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((s) => (
            <Link key={s.id} to={`/scenarios/${s.id}`}>
              <Card className="p-5 h-full hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 line-clamp-2">{s.name}</h3>
                  <Badge color="blue">{s.application_type}</Badge>
                </div>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{s.description || 'No description'}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                  <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {s.organization_name}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(s.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400">{s.user_count.toLocaleString()} users</span>
                  <span className="text-sm text-sky-600 font-medium inline-flex items-center gap-1">
                    View <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
