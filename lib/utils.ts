export const cn = (...classes: (string | false | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const formatListeners = (n: number): string => {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
};
