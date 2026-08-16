export interface PlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTrack: {
    title: string;
    artist: string;
  };
  isLoading: boolean;
  hasError: boolean;
}
