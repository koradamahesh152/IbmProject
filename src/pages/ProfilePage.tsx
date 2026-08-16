import { useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { updateProfileName } from '@/services/userService';
import { Card, PageHeader, Badge } from '@/components/ui';
import { Mail, Shield, User as UserIcon, Save, Loader2 } from 'lucide-react';

export function ProfilePage() {
  const { profile, user, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true); setMessage(null);
    const { error } = await updateProfileName(user!.id, fullName);
    if (error) setMessage(error); else { setMessage('Profile updated successfully'); await refreshProfile(); }
    setSaving(false);
  }

  return (
    <DashboardLayout>
      <PageHeader title="Profile" subtitle="Your account information" />
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Account Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-gray-400" /><div><p className="text-xs text-gray-500">Email</p><p className="text-sm font-medium text-gray-800">{user?.email}</p></div></div>
            <div className="flex items-center gap-3"><Shield className="w-5 h-5 text-gray-400" /><div><p className="text-xs text-gray-500">Role</p><Badge color={profile?.role === 'admin' ? 'green' : 'blue'}>{profile?.role}</Badge></div></div>
            <div className="flex items-center gap-3"><UserIcon className="w-5 h-5 text-gray-400" /><div><p className="text-xs text-gray-500">Member since</p><p className="text-sm font-medium text-gray-800">{profile ? new Date(profile.created_at).toLocaleDateString() : ''}</p></div></div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Edit Profile</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none text-sm" />
            </div>
            {message && <p className={`text-sm ${message.includes('success') ? 'text-emerald-600' : 'text-red-600'}`}>{message}</p>}
            <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
            </button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
