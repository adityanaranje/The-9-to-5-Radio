export interface Track {
  title: string;
  artist: string;
}

export interface Station {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  mood: string;
  artwork: string;
  youtubePlaylistId: string;
  listeners: number;
  accentColor: string;
  tags: string[];
  tracks: Track[];
}
