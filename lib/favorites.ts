import { Station } from '@/types/station';

const FAVORITES_KEY = '9to5_favorites';

export const getFavorites = (): Station[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveFavorites = (stations: Station[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(stations));
  } catch {
    // ignore
  }
};

export const toggleFavorite = (station: Station): Station[] => {
  const current = getFavorites();
  const exists = current.find((s) => s.id === station.id);
  let next: Station[];
  if (exists) {
    next = current.filter((s) => s.id !== station.id);
  } else {
    next = [...current, station];
  }
  saveFavorites(next);
  return next;
};

export const isFavorite = (stationId: string): boolean => {
  return getFavorites().some((s) => s.id === stationId);
};
