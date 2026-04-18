import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { UserSettings } from '../types';

const DEFAULT_SETTINGS: UserSettings = {
  id: 'user-settings',
  weightUnit: 'kg',
  defaultRestTimer: 90,
  theme: 'dark',
};

export function useSettings(): UserSettings {
  const settings = useLiveQuery(() => db.settings.get('user-settings'));
  return settings ?? DEFAULT_SETTINGS;
}

export async function updateSettings(updates: Partial<UserSettings>): Promise<void> {
  await db.settings.update('user-settings', updates);
}
