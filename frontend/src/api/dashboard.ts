import { api } from './http';
import type { DashboardSummary } from '../types';

export async function getDashboard(): Promise<DashboardSummary> {
  const { data } = await api.get<DashboardSummary>('/dashboard');
  return data;
}
