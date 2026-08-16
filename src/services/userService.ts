// ============================================================
// User Service — Admin user management
// ============================================================

import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types';
import { logAudit } from './auditService';

export async function getAllProfiles(): Promise<{ data: Profile[] | null; error: string | null }> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return { data: null, error: error.message };
  return { data: data as Profile[], error: null };
}

export async function updateProfileRole(
  userId: string,
  role: 'admin' | 'analyst'
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId);

  if (error) return { error: error.message };

  await logAudit('user_update', 'user', userId, { role });
  return { error: null };
}

export async function updateProfileName(
  userId: string,
  fullName: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('profiles')
    .update({ full_name: fullName })
    .eq('id', userId);

  if (error) return { error: error.message };
  return { error: null };
}
