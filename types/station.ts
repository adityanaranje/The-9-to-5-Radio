export interface Station {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  mood: string;
  artwork: string;
  listeners: number;
  accentColor: string;
  tags: string[];
  listenerEmoji: string;
  listenerPhrase: string;
}
