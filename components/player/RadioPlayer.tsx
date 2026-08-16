'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ListMusic } from 'lucide-react';
import { loadYouTubeApi, buildTrackQuery } from '@/lib/youtube';
import { Track } from '@/types/station';

interface PlayerProps {
  tracks: Track[];
  onStateChange?: (isPlaying: boolean) => void;
  onError?: (hasError: boolean) => void;
}

export default function RadioPlayer({ tracks, onStateChange, onError }: PlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(60);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const playerRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<any>(null);
  const indexRef = useRef(0);
  const playingRef = useRef(false);
  const tracksRef = useRef<Track[]>(tracks);

  useEffect(() => {
    tracksRef.current = tracks;
  }, [tracks]);

  const currentTrack = tracksRef.current[currentIndex] ?? tracksRef.current[0];

  const playIndex = useCallback(
    (index: number) => {
      const list = tracksRef.current;
      if (list.length === 0) return;
      const safeIndex = ((index % list.length) + list.length) % list.length;
      indexRef.current = safeIndex;
      setCurrentIndex(safeIndex);
      const player = ytPlayerRef.current;
      const track = list[safeIndex];
      if (!player || !track) return;
      try {
        player.loadPlaylist({
          list: buildTrackQuery(track.title, track.artist),
          listType: 'search',
          index: 0,
          startSeconds: 0,
        });
        if (playingRef.current) player.playVideo();
      } catch {
        // ignore — the player may not be ready yet
      }
    },
    []
  );

  useEffect(() => {
    if (tracks.length === 0) {
      setHasError(true);
      onError?.(true);
      setIsLoading(false);
      return;
    }
    // (Re)initialize the player when the track list changes.
    if (ytPlayerRef.current) {
      try {
        ytPlayerRef.current.destroy();
      } catch {
        // ignore
      }
      ytPlayerRef.current = null;
    }
    setCurrentIndex(0);
    indexRef.current = 0;
    setIsLoading(true);
    setHasError(false);

    let cancelled = false;
    loadYouTubeApi()
      .then(() => {
        if (cancelled || !playerRef.current || !window.YT || !window.YT.Player) {
          setIsLoading(false);
          return;
        }
        const first = tracksRef.current[0];
        try {
          ytPlayerRef.current = new (window.YT as any).Player(playerRef.current, {
            height: '0',
            width: '0',
            playerVars: {
              autoplay: 0,
              controls: 0,
              disablekb: 1,
              modestbranding: 1,
              rel: 0,
              listType: 'search',
              list: first ? buildTrackQuery(first.title, first.artist) : undefined,
            },
            events: {
              onReady: () => {
                setIsLoading(false);
                ytPlayerRef.current?.setVolume(volume);
              },
              onStateChange: (event: any) => {
                const playing = event.data === window.YT?.PlayerState?.PLAYING;
                playingRef.current = playing;
                setIsPlaying(playing);
                onStateChange?.(playing);
                if (event.data === window.YT?.PlayerState?.ENDED) {
                  playIndex(indexRef.current + 1);
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
      })
      .catch(() => {
        if (!cancelled) {
          setHasError(true);
          onError?.(true);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks]);

  const handlePlay = () => {
    const player = ytPlayerRef.current;
    if (player && !isLoading && !hasError) {
      try {
        player.playVideo();
        playingRef.current = true;
      } catch {
        // ignore
      }
    }
  };

  const handlePause = () => {
    const player = ytPlayerRef.current;
    if (player) {
      try {
        player.pauseVideo();
        playingRef.current = false;
      } catch {
        // ignore
      }
    }
  };

  const handleNext = () => playIndex(indexRef.current + 1);
  const handlePrev = () => playIndex(indexRef.current - 1);
  const handleSelect = (index: number) => {
    playingRef.current = isPlaying;
    playIndex(index);
  };

  const handleMuteToggle = () => {
    const player = ytPlayerRef.current;
    if (player) {
      try {
        if (player.isMuted && player.isMuted()) {
          player.unMute();
          setIsMuted(false);
        } else {
          player.mute();
          setIsMuted(true);
        }
      } catch {
        // ignore
      }
    }
  };

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    const player = ytPlayerRef.current;
    if (player) {
      try {
        player.setVolume(v);
        if (v > 0 && isMuted) {
          player.unMute();
          setIsMuted(false);
        }
      } catch {
        // ignore
      }
    }
  };

  if (tracks.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-white/[0.03] rounded-2xl border border-white/5">
        <span className="text-sm text-white/30">This station is coming soon.</span>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div ref={playerRef} className="hidden" aria-hidden="true" />

      {/* Play / prev / next */}
      <div className="flex items-center justify-center gap-3 mb-3">
        <button
          onClick={handlePrev}
          aria-label="Previous"
          className="h-10 w-10 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-paper hover:bg-white/10 flex items-center justify-center transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <button
          onClick={isPlaying ? handlePause : handlePlay}
          disabled={isLoading}
          className="h-16 w-16 rounded-full bg-amber hover:bg-amber/90 text-ink flex items-center justify-center shadow-xl shadow-amber/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <span className="flex gap-1.5">
              <span className="w-1.5 h-6 bg-ink rounded-full" />
              <span className="w-1.5 h-6 bg-ink rounded-full" />
            </span>
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
          )}
        </button>
        <button
          onClick={handleNext}
          aria-label="Next"
          className="h-10 w-10 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-paper hover:bg-white/10 flex items-center justify-center transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>

      {/* Progress + status */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-[11px] text-white/20 font-mono shrink-0">{isLoading ? 'LOADING' : isPlaying ? 'ON AIR' : 'PAUSED'}</span>
        <div className="flex-1 h-[2px] bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber via-coral to-amber rounded-full transition-all duration-500"
            style={{ width: isLoading ? '20%' : isPlaying ? '55%' : '40%' }}
          />
        </div>
        <span className="text-[11px] text-white/20 font-mono shrink-0">
          {String(currentIndex + 1).padStart(2, '0')}/{String(tracks.length).padStart(2, '0')}
        </span>
      </div>

      {/* Volume */}
      <div className="flex items-center justify-center gap-3 mb-3">
        <button
          onClick={handleMuteToggle}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          className="text-white/20 hover:text-paper transition-colors"
        >
          {isMuted || volume === 0 ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z" /><polygon points="17 7.52 23 9.52 17 11.52 17 7.52" /></svg>
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
      </div>

      {/* Now playing */}
      {hasError ? (
        <div className="flex flex-col items-center justify-center h-24 bg-red-900/10 rounded-2xl border border-red-500/10 mb-3">
          <span className="text-sm text-red-300/60 mb-1">Playback error</span>
          <span className="text-[10px] text-white/20">Check your connection or try another station.</span>
        </div>
      ) : (
        currentTrack && (
          <div className="text-center mb-3">
            <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Now Playing</p>
            <p className="font-serif text-xl text-white font-medium mt-1 leading-tight">{currentTrack.title}</p>
            <p className="text-sm text-white/30">{currentTrack.artist}</p>
          </div>
        )
      )}

      {/* Tracklist */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5">
          <ListMusic size={14} className="text-amber" />
          <span className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">Tracklist</span>
        </div>
        <ul className="max-h-48 overflow-y-auto overscroll-contain divide-y divide-white/[0.03]">
          {tracks.map((track, i) => {
            const active = i === currentIndex;
            return (
              <li key={`${track.title}-${i}`}>
                <button
                  onClick={() => handleSelect(i)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${
                    active ? 'bg-amber/10' : 'hover:bg-white/[0.04]'
                  }`}
                >
                  <span className={`w-6 text-[11px] font-mono shrink-0 ${active ? 'text-amber' : 'text-white/20'}`}>
                    {active ? '▶' : String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block text-sm truncate ${active ? 'text-amber' : 'text-white/70'}`}>{track.title}</span>
                    <span className="block text-[11px] text-white/25 truncate">{track.artist}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
