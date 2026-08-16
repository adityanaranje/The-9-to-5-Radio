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

export const getPlaylistVideoIds = async (playlistId: string): Promise<string[]> => {
  // For production, we would use the YouTube Data API.
  // For V1, we return a simulated playlist of video IDs based on the station.
  const simulatedIds: Record<string, string[]> = {
    'PLG8vA5q1Vf8W8n9b0Yt8xL3K7cJ5nQ4m': ['dQw4w9WgXcQ', 'JGwWNGJdvx8', 'LXb3EKWsInQ'],
    'PLF5vW7z0Yt6pK9nL3x8s5B4c2D7mQ1r': ['9bZkp7q19f0', 'kJQP7kiw5Fk', 'aJOTlE1K90k'],
    'PLM7b6X1t4Y9w3zQ8p5K2nL8xC4vB1dA': ['o-oG6TzWP0A', '2Vv-BfVoq4g', 'M3mJkSqZbX8'],
    'PLN8v2p3bQ7xW5y9m4K1l3J6h8cT2r4B': ['6cZ6yLJ9T1k', 'M4f8wV3p2rQ', 'P7s2dQ9v7bL'],
    'PLS3q5L7vW9y2z4X8k6J1m5N3p7T4r8B': ['tVj0ZTSOqYM', 'hLQl3WQQoQ0', 'L_jWHffIx5E'],
    'PLK9m2Z3v7W4y8t6n5B1c3D8p2Q7l4R': ['CevxZvSJLk8', 'kXYiU_JCYtU', '60ItHLz5WEA'],
    'PLT6v4W2x8Z3y9b5N7k1L4m2C3p8Q5r': ['3tmd-ClpJxA', 'g8mE7pB3w9Q', 'sO2o98zjzNw'],
    'PLB7w5N4z9T3m6X2y1K8p5L7v4C3r9Q': ['YQHsXMglC9A', 'jfKfPfyJRdk', '5qap5aO4i9A'],
    'PLI3v8w2Y5z7t6N9k4M2p8L1B4c7X3r': ['XqZsoesa55w', '9iG9lWmBbBw', 'Lj5A3kYF8kA'],
    'PLF3w6Y9z2X5t7B1k4N8m3L6p2Q9r8C': ['4fndeDfaWCg', '5qap5aO4i9A', '3tmd-ClpJxA'],
    'PLD9v2Z4y7W6t3N5k8B1m4L7p2C9r3X': ['hLQl3WQQoQ0', 'tVj0ZTSOqYM', '2Vv-BfVoq4g'],
    'PLR5v6y3W9t2Z7k4B1m8N3p6L2C9X4r': ['L_jWHffIx5E', 'LXb3EKWsInQ', '9bZkp7q19f0'],
    'PLX8y5W3z9t2B7m4K1n6L3p8C2v5R9Q': ['jfKfPfyJRdk', 'XqZsoesa55w', 'kJQP7kiw5Fk'],
    'PLQ7v5W2y9t4B6k3M1n8L2p5C7r3X9Z': ['P7s2dQ9v7bL', 'M3mJkSqZbX8', 'CevxZvSJLk8'],
    'PLK3v6W9y2t5B8m7N4p1L6c3X2z9Q5r': ['M4f8wV3p2rQ', 'o-oG6TzWP0A', 'g8mE7pB3w9Q'],
  };
  return simulatedIds[playlistId] || ['dQw4w9WgXcQ'];
};
