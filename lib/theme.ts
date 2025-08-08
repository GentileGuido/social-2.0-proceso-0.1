export const themeToBg = (t: string) => {
  const themes = {
    pink: 'bg-pink-600 hover:bg-pink-700 focus:ring-pink-300',
    teal: 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-300',
    amber:'bg-amber-600 hover:bg-amber-700 focus:ring-amber-300',
    neutral:'bg-neutral-700 hover:bg-neutral-800 focus:ring-neutral-400',
    red:  'bg-red-600 hover:bg-red-700 focus:ring-red-300',
    green:'bg-green-600 hover:bg-green-700 focus:ring-green-300',
    blue: 'bg-sky-600 hover:bg-sky-700 focus:ring-sky-300',
  };
  return themes[t as keyof typeof themes] ?? 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-300';
};

export const themeToRing = (t: string) => {
  const themes = {
    pink: 'focus:ring-pink-300',
    teal: 'focus:ring-teal-300',
    amber:'focus:ring-amber-300',
    neutral:'focus:ring-neutral-400',
    red:  'focus:ring-red-300',
    green:'focus:ring-green-300',
    blue: 'focus:ring-sky-300',
  };
  return themes[t as keyof typeof themes] ?? 'focus:ring-teal-300';
};

export const themeToColor = (t: string) => {
  const themes = {
    pink: 'bg-pink-600',
    teal: 'bg-teal-600',
    amber:'bg-amber-600',
    neutral:'bg-neutral-700',
    red:  'bg-red-600',
    green:'bg-green-600',
    blue: 'bg-sky-600',
  };
  return themes[t as keyof typeof themes] ?? 'bg-teal-600';
};
