import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { getAllProfiles, updateProfileRole } from '@/services/userService';
import { Card, Badge, LoadingState, ErrorState, PageHeader } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import type { Profile } from '@/types';
import { Users, Shield, User as UserIcon } from 'lucide-react';

export function UserManagementPage() {
  const { profile: currentUser } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true); setError(null);
    const { data, error } = await getAllProfiles();
    if (error) setError(error); else setUsers(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleRoleChange(userId: string, role: 'admin' | 'analyst') {
    const { error } = await updateProfileRole(userId, role);
    if (error) { setError(error); return; }
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role } : u));
  }

  if (loading) return <DashboardLayout><LoadingState /></DashboardLayout>;
  if (error) return <DashboardLayout><ErrorState message={error} onRetry={load} /></DashboardLayout>;

  return (
    <DashboardLayout>
      <PageHeader title="User Management" subtitle="Manage user roles and access" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Users" value={users.length} icon={<Users className="w-5 h-5" />} />
        <StatCard label="Admins" value={users.filter((u) => u.role === 'admin').length} icon={<Shield className="w-5 h-5" />} />
        <StatCard label="Analysts" value={users.filter((u) => u.role === 'analyst').length} icon={<UserIcon className="w-5 h-5" />} />
      </div>

      <Card className="p-5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-200 text-left text-gray-500"><th className="py-2.5 px-3">Name</th><th className="py-2.5 px-3">Email</th><th className="py-2.5 px-3">Role</th><th className="py-2.5 px-3">Joined</th><th className="py-2.5 px-3">Action</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-3 font-medium text-gray-800">{u.full_name || '(no name)'}</td>
                <td className="py-3 px-3 text-gray-600">{u.email}</td>
                <td className="py-3 px-3"><Badge color={u.role === 'admin' ? 'green' : 'blue'}>{u.role}</Badge></td>
                <td className="py-3 px-3 text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="py-3 px-3">
                  {u.id === currentUser?.id ? (
                    <span className="text-xs text-gray-400">You</span>
                  ) : (
                    <select value={u.role} onChange={(e) => handleRoleChange(u.id, e.target.value as 'admin' | 'analyst')} className="text-xs border border-gray-200 rounded px-2 py-1">
                      <option value="analyst">Analyst</option>
                      <option value="admin">Admin</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </DashboardLayout>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return <Card className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">{label}</p><p className="text-2xl font-bold text-gray-800">{value}</p></div><div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">{icon}</div></div></Card>;
}
