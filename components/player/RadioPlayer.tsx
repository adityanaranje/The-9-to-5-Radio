import { useState, useRef, useEffect, useCallback } from 'react';
import { loadYouTubeApi, getPlaylistVideoIds } from '@/lib/youtube';

interface PlayerProps {
  playlistId: string;
  onStateChange?: (isPlaying: boolean) => void;
  onTrackChange?: (track: { title: string; artist: string }) => void;
  onError?: (hasError: boolean) => void;
}

export default function RadioPlayer({ playlistId, onStateChange, onTrackChange, onError }: PlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videoIds, setVideoIds] = useState<string[]>([]);
  const playerRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<any>(null);

  useEffect(() => {
    if (!playlistId) {
      setHasError(true);
      onError?.(true);
      setIsLoading(false);
      return;
    }

    getPlaylistVideoIds(playlistId).then((ids) => {
      setVideoIds(ids);
      if (ids.length === 0) {
        setHasError(true);
        onError?.(true);
      }
    }).catch(() => {
      setHasError(true);
      onError?.(true);
    });
  }, [playlistId, onError]);

  const initializePlayer = useCallback(() => {
    if (!playerRef.current || videoIds.length === 0 || hasError) return;
    if (ytPlayerRef.current) return;

    setIsLoading(true);
    loadYouTubeApi().then(() => {
      try {
        if (!playerRef.current || !window.YT || !window.YT.Player) {
          setIsLoading(false);
          return;
        }
        ytPlayerRef.current = new (window.YT as any).Player(playerRef.current, {
          height: '0',
          width: '0',
          videoId: videoIds[currentVideoIndex],
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            rel: 0,
          },
          events: {
            onReady: () => {
              setIsLoading(false);
              ytPlayerRef.current.setVolume(volume);
              onStateChange?.(isPlaying);
            },
            onStateChange: (event: any) => {
              const playing = event.data === window.YT?.PlayerState?.PLAYING;
              setIsPlaying(playing);
              onStateChange?.(playing);
              if (event.data === window.YT?.PlayerState?.ENDED) {
                const nextIndex = (currentVideoIndex + 1) % videoIds.length;
                setCurrentVideoIndex(nextIndex);
                ytPlayerRef.current.loadVideoById(videoIds[nextIndex]);
              }
              if (event.data === window.YT?.PlayerState?.ERROR) {
                setHasError(true);
                onError?.(true);
              }
            },
            onError: () => {
              setHasError(true);
              onError?.(true);
            },
          },
        });
      } catch {
        setHasError(true);
        onError?.(true);
        setIsLoading(false);
      }
    }).catch(() => {
      setHasError(true);
      onError?.(true);
      setIsLoading(false);
    });
  }, [videoIds, currentVideoIndex, isPlaying, volume, onStateChange, onError, hasError]);

  useEffect(() => {
    if (videoIds.length > 0 && !ytPlayerRef.current && !hasError) {
      initializePlayer();
    }
  }, [videoIds, initializePlayer, hasError]);

  useEffect(() => {
    if (videoIds.length > 0 && ytPlayerRef.current && !isLoading && !hasError) {
      const currentId = videoIds[currentVideoIndex];
      try {
        ytPlayerRef.current.loadVideoById(currentId);
      } catch {
        setHasError(true);
        onError?.(true);
      }
    }
  }, [currentVideoIndex, videoIds, isLoading, hasError, onError]);

  const handlePlay = () => {
    if (ytPlayerRef.current && !isLoading && !hasError) {
      try {
        ytPlayerRef.current.playVideo();
      } catch {
        // ignore
      }
    }
  };

  const handlePause = () => {
    if (ytPlayerRef.current && !isLoading && !hasError) {
      try {
        ytPlayerRef.current.pauseVideo();
      } catch {
        // ignore
      }
    }
  };

  const handleNext = () => {
    if (videoIds.length > 0) {
      const nextIndex = (currentVideoIndex + 1) % videoIds.length;
      setCurrentVideoIndex(nextIndex);
    }
  };

  const handlePrev = () => {
    if (videoIds.length > 0) {
      const prevIndex = (currentVideoIndex - 1 + videoIds.length) % videoIds.length;
      setCurrentVideoIndex(prevIndex);
    }
  };

  const handleMuteToggle = () => {
    if (ytPlayerRef.current) {
      try {
        if (ytPlayerRef.current.isMuted && ytPlayerRef.current.isMuted()) {
          ytPlayerRef.current.unMute();
          setIsMuted(false);
        } else {
          ytPlayerRef.current.mute();
          setIsMuted(true);
        }
      } catch {
        // ignore
      }
    }
  };

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    if (ytPlayerRef.current) {
      try {
        ytPlayerRef.current.setVolume(v);
        if (v > 0 && isMuted) {
          ytPlayerRef.current.unMute();
          setIsMuted(false);
        }
      } catch {
        // ignore
      }
    }
  };

  // Auto-play attempt on user interaction, not before
  if (!playlistId) {
    return (
      <div className="flex items-center justify-center h-48 bg-white/[0.03] rounded-2xl border border-white/5">
        <span className="text-sm text-white/30">This station is coming soon.</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={playerRef} className="hidden" aria-hidden="true" />

      {isLoading && (
        <div className="flex items-center justify-center h-48 bg-white/[0.02] rounded-2xl border border-white/5 animate-pulse">
          <span className="text-xs text-white/20 tracking-[0.15em] uppercase">Loading station...</span>
        </div>
      )}

      {hasError && (
        <div className="flex flex-col items-center justify-center h-48 bg-red-900/10 rounded-2xl border border-red-500/10">
          <span className="text-sm text-red-300/60 mb-1">Playback error</span>
          <span className="text-[10px] text-white/20">Check your connection or try another station.</span>
        </div>
      )}

      {!isLoading && !hasError && (
        <>
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={isPlaying ? handlePause : handlePlay}
              className="h-14 w-14 rounded-full bg-amber hover:bg-amber/90 text-ink flex items-center justify-center shadow-xl shadow-amber/20 transition-all hover:scale-105 active:scale-95"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <span className="flex gap-1">
                  <span className="w-1 h-5 bg-ink rounded-full" />
                  <span className="w-1 h-5 bg-ink rounded-full" />
                </span>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              )}
            </button>
            <button
              onClick={handlePrev}
              aria-label="Previous"
              className="h-10 w-10 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-paper hover:bg-white/10 flex items-center justify-center transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button
              onClick={handleNext}
              aria-label="Next"
              className="h-10 w-10 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-paper hover:bg-white/10 flex items-center justify-center transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-[11px] text-white/20 font-mono">{isPlaying ? 'ON AIR' : 'PAUSED'}</span>
            <div className="flex-1 h-[2px] bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber via-coral to-amber rounded-full transition-all duration-500"
                style={{ width: '40%' }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={handleMuteToggle}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              className="text-white/20 hover:text-paper transition-colors"
            >
              {isMuted || volume === 0 ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z" /><polygon points="17 7.52 23 9.52 17 11.52 17 7.52" /></svg>
              )}
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-24 h-1 rounded-full appearance-none bg-white/10 accent-amber cursor-pointer"
            />
            <span className="text-[10px] font-mono text-white/20">{volume}</span>
          </div>
        </>
      )}

      {!playlistId ? (
        <div className="flex items-center justify-center h-48 bg-white/[0.03] rounded-2xl border border-white/5 mt-2">
          <span className="text-sm text-white/30">This station is coming soon.</span>
        </div>
      ) : null}
    </div>
  );
}
