import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { getAuditLogs } from '@/services/auditService';
import { Card, Badge, LoadingState, ErrorState, PageHeader } from '@/components/ui';
import type { AuditLog } from '@/types';
import { ScrollText, Clock } from 'lucide-react';

const ACTION_COLORS: Record<string, 'blue' | 'green' | 'amber' | 'red' | 'slate'> = {
  login: 'blue', register: 'green', create_scenario: 'green', update_scenario: 'amber',
  delete_scenario: 'red', run_analysis: 'blue', generate_report: 'slate', user_update: 'amber', user_delete: 'red',
};

const ACTION_LABELS: Record<string, string> = {
  login: 'Login', register: 'Register', create_scenario: 'Created Scenario', update_scenario: 'Updated Scenario',
  delete_scenario: 'Deleted Scenario', run_analysis: 'Ran Analysis', generate_report: 'Generated Report',
  user_update: 'Updated User', user_delete: 'Deleted User',
};

export function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true); setError(null);
    const { data, error } = await getAuditLogs(200);
    if (error) setError(error); else setLogs(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  if (loading) return <DashboardLayout><LoadingState /></DashboardLayout>;
  if (error) return <DashboardLayout><ErrorState message={error} onRetry={load} /></DashboardLayout>;

  return (
    <DashboardLayout>
      <PageHeader title="Audit Logs" subtitle="Track all user actions in the system" />
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4"><ScrollText className="w-5 h-5 text-slate-700" /><span className="text-sm text-gray-500">{logs.length} entries</span></div>
        {logs.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No audit logs yet.</p>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                <Badge color={ACTION_COLORS[log.action] || 'slate'}>{ACTION_LABELS[log.action] || log.action}</Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{log.entity && `${log.entity}: `}{log.entity_id && <span className="font-mono text-xs text-gray-400">{log.entity_id.slice(0, 8)}</span>}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-2"><Clock className="w-3 h-3" />{new Date(log.created_at).toLocaleString()} · {log.user_email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
