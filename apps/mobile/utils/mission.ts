import type { Mission } from '@/types/driver';

export function getCompanyName(mission: Mission): string {
  const c = mission.companyId;
  if (c && typeof c === 'object' && c !== null && 'companyName' in c) {
    return String((c as { companyName?: string }).companyName ?? '');
  }
  return '';
}

export function statusLabel(status: string): string {
  return status.replace(/_/g, ' ');
}
