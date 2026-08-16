// ============================================================
// Scenario Service — CRUD operations for cloud decision scenarios
// ============================================================

import { supabase } from '@/lib/supabase';
import type { Scenario, ScenarioInput } from '@/types';
import { logAudit } from './auditService';

export async function createScenario(input: ScenarioInput): Promise<{ data: Scenario | null; error: string | null }> {
  const { data, error } = await supabase
    .from('scenarios')
    .insert(input)
    .select()
    .single();

  if (error) return { data: null, error: error.message };

  await logAudit('create_scenario', 'scenario', data.id, { name: data.name });
  return { data: data as Scenario, error: null };
}

export async function getScenarios(): Promise<{ data: Scenario[] | null; error: string | null }> {
  const { data, error } = await supabase
    .from('scenarios')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return { data: null, error: error.message };
  return { data: data as Scenario[], error: null };
}

export async function getScenarioById(id: string): Promise<{ data: Scenario | null; error: string | null }> {
  const { data, error } = await supabase
    .from('scenarios')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) return { data: null, error: error.message };
  return { data: data as Scenario | null, error: null };
}

export async function updateScenario(id: string, input: Partial<ScenarioInput>): Promise<{ data: Scenario | null; error: string | null }> {
  const { data, error } = await supabase
    .from('scenarios')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) return { data: null, error: error.message };

  await logAudit('update_scenario', 'scenario', id, { name: data.name });
  return { data: data as Scenario, error: null };
}

export async function deleteScenario(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('scenarios')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };

  await logAudit('delete_scenario', 'scenario', id, {});
  return { error: null };
}
