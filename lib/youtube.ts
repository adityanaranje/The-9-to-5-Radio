declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string | HTMLElement,
        options?: {
          videoId?: string;
          playerVars?: {
            autoplay?: 0 | 1;
            controls?: 0 | 1 | 2;
            disablekb?: 0 | 1;
            modestbranding?: 0 | 1;
            rel?: 0 | 1;
            origin?: string;
            listType?: 'playlist' | 'search' | 'user_uploads';
            list?: string;
          };
          events?: {
            onReady?: (event: { target: unknown }) => void;
            onStateChange?: (event: { data: number; target: unknown }) => void;
            onError?: (event: { data: number; target: unknown }) => void;
          };
        }
      ) => {
        playVideo: () => void;
        pauseVideo: () => void;
        stopVideo: () => void;
        seekTo: (seconds: number) => void;
        setVolume: (volume: number) => void;
        mute: () => void;
        unMute: () => void;
        isMuted: () => boolean;
        getVolume: () => number;
        getPlayerState: () => number;
        getCurrentTime: () => number;
        getDuration: () => number;
        destroy: () => void;
        loadPlaylist: (
          playlist:
            | string
            | string[]
            | { list?: string; listType?: 'playlist' | 'search' | 'user_uploads'; index?: number; startSeconds?: number },
          index?: number,
          startSeconds?: number
        ) => void;
        cuePlaylist: (
          playlist:
            | string
            | string[]
            | { list?: string; listType?: 'playlist' | 'search' | 'user_uploads'; index?: number; startSeconds?: number },
          index?: number,
          startSeconds?: number
        ) => void;
        nextVideo: () => void;
        previousVideo: () => void;
        playVideoAt: (index: number) => void;
        getPlaylist: () => string[];
        getPlaylistIndex: () => number;
        getVideoData: () => { video_id: string; author: string; title: string };
      };
      PlayerState?: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
        ERROR: number;
      };
      ready?: (callback: () => void) => void;
    };
  }
}

export const normalizePlaylistId = (value: string): string => {
  const trimmed = (value || '').trim();
  if (!trimmed) return '';
  // Full URL or a "list=..." fragment → extract just the ID.
  const match = trimmed.match(/[?&]list=([^&\s#]+)/);
  if (match) return match[1];
  return trimmed;
};

export const loadYouTubeApi = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return resolve();
    if (window.YT && window.YT.Player) return resolve();

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    tag.onload = () => {
      const interval = setInterval(() => {
        if (window.YT && window.YT.Player && window.YT.ready) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    };
    tag.onerror = () => reject(new Error('Failed to load YouTube IFrame API'));
    document.body.appendChild(tag);
  });
};
