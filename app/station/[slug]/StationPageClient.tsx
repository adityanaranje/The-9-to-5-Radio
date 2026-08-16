'use client';

import Link from 'next/link';
import { ArrowLeft, Heart, Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Station } from '@/types/station';
import { isFavorite, toggleFavorite } from '@/lib/favorites';
import { addRecentlyPlayed } from '@/lib/recentlyPlayed';
import { formatListeners } from '@/lib/utils';
import { stationPlaylists } from '@/data/playlists';
import { useLiveListeners } from '@/lib/useLiveListeners';
import RadioPlayer from '@/components/player/RadioPlayer';
import Equalizer from '@/components/player/Equalizer';

export default function StationPageClient({ station }: { station: Station }) {
  const [favorite, setFavorite] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const liveListeners = useLiveListeners(station.listeners);

  useEffect(() => {
    setFavorite(isFavorite(station.id));
    addRecentlyPlayed(station);
  }, [station]);

  const handleFavorite = () => {
    toggleFavorite(station);
    setFavorite(!favorite);
  };

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      await navigator.clipboard.writeText(url);
      setShowShare(true);
      setTimeout(() => setShowShare(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative h-[100svh] w-full overflow-hidden bg-ink">
      {/* Background Artwork */}
      <div className="absolute inset-0 z-0">
        <img
          src={station.artwork}
          alt={station.name}
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/55 to-ink/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-ink/70" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJibGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIuNiIgbnVtT2N0YXZlcz0iMyIgc3RpdGNoVGlsZXM9InN0aXRjaCIgLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9Ii4wMyIvPjwvc3ZnPg==')] opacity-50 mix-blend-overlay" />
      </div>

      <div className="relative z-10 flex h-full flex-col">
        {/* Header */}
        <header className="shrink-0 w-full px-4 md:px-10 pt-4 md:pt-5 pb-2 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-white/60 hover:text-paper transition-colors group">
            <span className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
              <ArrowLeft size={16} />
            </span>
            <span className="text-sm font-medium tracking-wide">9to5 RADIO</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={handleFavorite}
              aria-label="Favorite"
              className={`p-2.5 rounded-full border transition-all duration-300 ${
                favorite ? 'bg-coral/15 border-coral/30 text-coral' : 'bg-white/5 border-white/10 text-white/40 hover:text-paper hover:bg-white/10'
              }`}
            >
              <Heart size={18} fill={favorite ? '#e8774a' : 'transparent'} />
            </button>
            <button
              onClick={handleShare}
              aria-label="Share"
              className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-paper hover:bg-white/10 transition-all"
            >
              <Share2 size={18} />
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 min-h-0 w-full overflow-y-auto">
          <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col lg:flex-row items-center justify-center gap-5 md:gap-8 px-4 md:px-10 py-3 md:py-6">
            {/* Left — station info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="w-full lg:w-[46%] flex flex-col justify-center text-center lg:text-left"
            >
              <div className="mb-2 flex items-center justify-center lg:justify-start gap-3">
                <span className="w-8 h-[1px] bg-white/10" />
                <span className="text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase">{station.category}</span>
                <span className="w-8 h-[1px] bg-white/10 lg:hidden" />
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl xl:text-6xl font-bold text-paper leading-[0.95] tracking-tight mb-3 drop-shadow-2xl">
                {station.name}
              </h1>
              <p className="text-sm md:text-lg text-white/50 font-light mb-2 max-w-xl mx-auto lg:mx-0">{station.tagline}</p>
              <p className="text-xs md:text-sm text-white/30 max-w-xl mx-auto lg:mx-0 mb-4 line-clamp-3">{station.description}</p>

              <div className="inline-flex items-center justify-center lg:justify-start gap-2 rounded-full bg-white/5 border border-white/10 px-5 py-2 mb-4 backdrop-blur-md">
                <span className="text-sm leading-none">{station.listenerEmoji}</span>
                <span className="text-xs font-mono text-white/50">
                  {formatListeners(liveListeners)} people {station.listenerPhrase}
                </span>
                <span className="w-1 h-1 rounded-full bg-coral animate-pulse" />
              </div>

              <div className="mb-4">
                <Equalizer isPlaying={isPlaying} />
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                {station.tags.map((tag) => (
                  <span key={tag} className="text-[10px] uppercase tracking-widest text-white/20 bg-white/5 border border-white/5 px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              {showShare && (
                <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-coral mt-2">
                  Link copied to clipboard!
                </motion.p>
              )}
            </motion.div>

            {/* Right — player + tracklist */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="w-full lg:w-[48%] flex flex-col justify-center"
            >
              <div className="w-full max-w-md mx-auto rounded-3xl bg-ink/40 border border-white/10 backdrop-blur-md p-4 md:p-6 shadow-2xl shadow-black/40">
                <RadioPlayer
                  playlistId={stationPlaylists[station.id] ?? ''}
                  onStateChange={setIsPlaying}
                  onError={() => {}}
                />
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
