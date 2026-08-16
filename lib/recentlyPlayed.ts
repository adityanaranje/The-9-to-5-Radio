import { Station } from '@/types/station';

const RECENT_KEY = '9to5_recent';

export const getRecentlyPlayed = (): Station[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const addRecentlyPlayed = (station: Station): Station[] => {
  if (typeof window === 'undefined') return getRecentlyPlayed();
  const current = getRecentlyPlayed();
  const filtered = current.filter((s) => s.id !== station.id);
  const next = [station, ...filtered].slice(0, 8);
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
};
