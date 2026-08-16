// ============================================================
// Audit Log Service — Records user actions for accountability
// ============================================================

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import type { AuditLog } from '@/types';

export async function logAudit(
  action: string,
  entity: string,
  entityId: string,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('audit_logs').insert({
      user_id: user.id,
      user_email: user.email,
      action,
      entity,
      entity_id: entityId,
      metadata,
    });
  } catch (err) {
    console.error('Failed to log audit entry:', err);
  }
}

export async function getAuditLogs(limit = 100): Promise<{ data: AuditLog[] | null; error: string | null }> {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return { data: null, error: error.message };
  return { data: data as AuditLog[], error: null };
}

export async function getAllAuditLogs(limit = 200): Promise<{ data: AuditLog[] | null; error: string | null }> {
  // Admin view — uses service role via supabase client with elevated access
  // In production, this would go through an edge function
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return { data: null, error: error.message };
  return { data: data as AuditLog[], error: null };
}
