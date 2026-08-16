'use client';

import { useState, useRef, useEffect } from 'react';
import { ListMusic } from 'lucide-react';
import { loadYouTubeApi, normalizePlaylistId } from '@/lib/youtube';

interface PlayerProps {
  playlistId: string;
  onStateChange?: (isPlaying: boolean) => void;
  onError?: (hasError: boolean) => void;
}

const ERROR_MESSAGES: Record<number, string> = {
  2: 'Invalid playlist ID.',
  5: 'The player could not start.',
  100: 'Playlist not found. Check the ID.',
  101: 'Embedding not allowed for this video.',
  150: 'Embedding not allowed for this video.',
};

export default function RadioPlayer({ playlistId, onStateChange, onError }: PlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(60);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const [nowPlaying, setNowPlaying] = useState<{ title: string; artist: string } | null>(null);
  const [videoId, setVideoId] = useState<string>('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [playlistLength, setPlaylistLength] = useState(0);

  const playerRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<any>(null);
  const playlistIdRef = useRef('');
  const skipCountRef = useRef(0);

  const cleanId = normalizePlaylistId(playlistId);

  useEffect(() => {
    playlistIdRef.current = cleanId;
  }, [cleanId]);

  const refreshMeta = () => {
    const player = ytPlayerRef.current;
    if (!player) return;
    try {
      const data = player.getVideoData && player.getVideoData();
      if (data && data.title) {
        setNowPlaying({ title: data.title, artist: data.author || '' });
        if (data.video_id) setVideoId(data.video_id);
      }
      const list = player.getPlaylist && player.getPlaylist();
      if (list && Array.isArray(list)) setPlaylistLength(list.length);
      const idx = player.getPlaylistIndex && player.getPlaylistIndex();
      if (typeof idx === 'number') setPosition(idx);
    } catch {
      // ignore
    }
  };

  // Poll playback position for the seek bar.
  useEffect(() => {
    const interval = setInterval(() => {
      const player = ytPlayerRef.current;
      if (!player) return;
      try {
        const t = player.getCurrentTime && player.getCurrentTime();
        const d = player.getDuration && player.getDuration();
        if (typeof t === 'number') setCurrentTime(t);
        if (typeof d === 'number' && d > 0) setDuration(d);
      } catch {
        // ignore
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const id = playlistIdRef.current;

    if (!id) {
      setIsLoading(false);
      setHasError(false);
      setErrorCode(null);
      setNowPlaying(null);
      setVideoId('');
      setCurrentTime(0);
      setDuration(0);
      setPosition(0);
      setPlaylistLength(0);
      return;
    }

    if (ytPlayerRef.current) {
      try {
        ytPlayerRef.current.destroy();
      } catch {
        // ignore
      }
      ytPlayerRef.current = null;
    }

    setIsLoading(true);
    setHasError(false);
    setErrorCode(null);
    setNowPlaying(null);
    setVideoId('');
    setCurrentTime(0);
    setDuration(0);
    skipCountRef.current = 0;

    const handleError = () => {
      const player = ytPlayerRef.current;
      skipCountRef.current += 1;
      // A single unplayable video (e.g. embedding disabled) shouldn't kill the
      // whole station — try to skip ahead a few times before giving up.
      if (player && skipCountRef.current <= 5) {
        try {
          player.nextVideo();
          return;
        } catch {
          // fall through to hard error
        }
      }
      setHasError(true);
      onError?.(true);
      setIsLoading(false);
    };

    let cancelled = false;
    loadYouTubeApi()
      .then(() => {
        if (cancelled || !playerRef.current || !window.YT || !window.YT.Player) {
          setIsLoading(false);
          return;
        }
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
            },
            events: {
              onReady: () => {
                setIsLoading(false);
                try {
                  ytPlayerRef.current?.setVolume(volume);
                  // Cue the playlist by ID (object form is the reliable way).
                  ytPlayerRef.current?.cuePlaylist({ listType: 'playlist', list: id });
                } catch {
                  // ignore
                }
                refreshMeta();
              },
              onStateChange: (event: any) => {
                const playing = event.data === window.YT?.PlayerState?.PLAYING;
                if (playing) skipCountRef.current = 0;
                setIsPlaying(playing);
                onStateChange?.(playing);
                refreshMeta();
                if (event.data === window.YT?.PlayerState?.ERROR) {
                  handleError();
                }
              },
              onError: (event: any) => {
                setErrorCode(typeof event?.data === 'number' ? event.data : null);
                handleError();
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
  }, [playlistId]);

  const handlePlay = () => {
    const player = ytPlayerRef.current;
    if (player && !isLoading && !hasError) {
      try {
        player.playVideo();
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
      } catch {
        // ignore
      }
    }
  };

  const handleNext = () => {
    const player = ytPlayerRef.current;
    if (player) {
      try {
        player.nextVideo();
      } catch {
        // ignore
      }
    }
  };

  const handlePrev = () => {
    const player = ytPlayerRef.current;
    if (player) {
      try {
        player.previousVideo();
      } catch {
        // ignore
      }
    }
  };

  const handleJump = (index: number) => {
    const player = ytPlayerRef.current;
    if (player) {
      try {
        player.playVideoAt(index);
      } catch {
        // ignore
      }
    }
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

  const seekBy = (delta: number) => {
    const player = ytPlayerRef.current;
    if (!player) return;
    try {
      const t = player.getCurrentTime ? player.getCurrentTime() : 0;
      const d = player.getDuration ? player.getDuration() : 0;
      let target = (typeof t === 'number' ? t : 0) + delta;
      if (target < 0) target = 0;
      if (typeof d === 'number' && d > 0 && target > d) target = Math.max(0, d - 0.5);
      player.seekTo(target, true);
      setCurrentTime(target);
    } catch {
      // ignore
    }
  };

  const handleSeek = (value: number) => {
    const player = ytPlayerRef.current;
    if (!player) return;
    try {
      player.seekTo(value, true);
      setCurrentTime(value);
    } catch {
      // ignore
    }
  };

  const formatTime = (s: number): string => {
    if (!isFinite(s) || s < 0) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : null;

  // No playlist configured yet
  if (!cleanId) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 h-44 rounded-2xl border border-white/5 bg-white/[0.03] text-center px-6">
        <ListMusic size={20} className="text-white/20" />
        <span className="text-sm text-white/40">Playlist coming soon.</span>
        <span className="text-[11px] text-white/20">
          Add a YouTube playlist ID for this station in <code className="text-white/30">data/playlists.ts</code>.
        </span>
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

      {/* Status line */}
      <div className="flex items-center justify-center gap-3 mb-2">
        <span className="text-[11px] text-white/20 font-mono shrink-0">{isLoading ? 'LOADING' : isPlaying ? 'ON AIR' : 'PAUSED'}</span>
        {playlistLength > 0 && (
          <span className="text-[11px] text-white/20 font-mono shrink-0">
            {String(position + 1).padStart(2, '0')}/{String(playlistLength).padStart(2, '0')}
          </span>
        )}
      </div>

      {/* Seek — back 10s / progress / forward 10s */}
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => seekBy(-10)}
          aria-label="Back 10 seconds"
          className="h-8 w-8 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-paper hover:bg-white/10 flex items-center justify-center transition-all shrink-0"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0-8 8" /><polyline points="3 11 3 3 11 3" /><line x1="10" y1="10" x2="10" y2="15" /><line x1="10" y1="12.5" x2="13" y2="12.5" /></svg>
        </button>
        <span className="text-[10px] font-mono text-white/40 w-9 text-right shrink-0">{formatTime(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={duration > 0 ? duration : 0}
          step={1}
          value={Math.min(currentTime, duration > 0 ? duration : 0)}
          onChange={(e) => handleSeek(Number(e.target.value))}
          className="flex-1 h-1 rounded-full appearance-none bg-white/10 accent-amber cursor-pointer"
          aria-label="Seek"
        />
        <span className="text-[10px] font-mono text-white/40 w-9 shrink-0">{formatTime(duration)}</span>
        <button
          onClick={() => seekBy(10)}
          aria-label="Forward 10 seconds"
          className="h-8 w-8 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-paper hover:bg-white/10 flex items-center justify-center transition-all shrink-0"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 19a8 8 0 1 0 0-16 8 8 0 0 0 8 8" /><polyline points="21 11 21 3 13 3" /><line x1="14" y1="10" x2="14" y2="15" /><line x1="14" y1="12.5" x2="17" y2="12.5" /></svg>
        </button>
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

      {/* Now playing / error */}
      {hasError ? (
        <div className="flex flex-col items-center justify-center h-24 bg-red-900/10 rounded-2xl border border-red-500/10 mb-3 px-4 text-center">
          <span className="text-sm text-red-300/60 mb-1">
            {errorCode != null ? ERROR_MESSAGES[errorCode] || `Playback error (code ${errorCode})` : 'Playback error'}
          </span>
          <span className="text-[10px] text-white/20">Check the playlist ID in data/playlists.ts — the playlist must be Public or Unlisted.</span>
        </div>
      ) : (
        <div className="flex items-center gap-3 mb-3">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={nowPlaying?.title || 'Now playing'}
              className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10 shadow-lg"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl shrink-0 bg-white/5 border border-white/10 flex items-center justify-center">
              <ListMusic size={18} className="text-white/20" />
            </div>
          )}
          <div className="min-w-0 text-left">
            <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Now Playing</p>
            {nowPlaying ? (
              <>
                <p className="font-serif text-lg text-white font-medium mt-0.5 leading-tight line-clamp-2">{nowPlaying.title}</p>
                <p className="text-sm text-white/30 line-clamp-1">{nowPlaying.artist}</p>
              </>
            ) : (
              <p className="font-serif text-lg text-white/40 font-medium mt-0.5">{isLoading ? 'Loading playlist…' : 'Press play'}</p>
            )}
          </div>
        </div>
      )}

      {/* Tracklist (numbers only — titles need the YouTube Data API) */}
      {playlistLength > 0 && (
        <div className="rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5">
            <ListMusic size={14} className="text-amber" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">Playlist</span>
            <span className="ml-auto text-[10px] font-mono text-white/20">{playlistLength} tracks</span>
          </div>
          <ul className="max-h-40 overflow-y-auto overscroll-contain grid grid-cols-4 sm:grid-cols-5 gap-1 p-2">
            {Array.from({ length: playlistLength }).map((_, i) => {
              const active = i === position;
              return (
                <li key={i}>
                  <button
                    onClick={() => handleJump(i)}
                    aria-label={`Track ${i + 1}`}
                    className={`w-full rounded-lg py-1.5 text-[11px] font-mono transition-colors ${
                      active ? 'bg-amber text-ink' : 'text-white/40 hover:bg-white/10 hover:text-white/70'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
