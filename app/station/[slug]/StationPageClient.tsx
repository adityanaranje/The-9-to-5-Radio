'use client';

import Link from 'next/link';
import { ArrowLeft, Heart, Share2, Headphones } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Station } from '@/types/station';
import { isFavorite, toggleFavorite } from '@/lib/favorites';
import { addRecentlyPlayed } from '@/lib/recentlyPlayed';
import { formatListeners } from '@/lib/utils';
import RadioPlayer from '@/components/player/RadioPlayer';
import Equalizer from '@/components/player/Equalizer';

export default function StationPageClient({ station }: { station: Station }) {
  const [favorite, setFavorite] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState({ title: 'Unknown Track', artist: 'Unknown Artist' });
  const [showShare, setShowShare] = useState(false);

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
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Artwork */}
      <div className="absolute inset-0 z-0">
        <img
          src={station.artwork}
          alt={station.name}
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/50 to-ink/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-ink/60" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJibGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIuNiIgbnVtT2N0YXZlcz0iMyIgc3RpdGNoVGlsZXM9InN0aXRjaCIgLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9Ii4wMyIvPjwvc3ZnPg==')] opacity-50 mix-blend-overlay" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="w-full px-6 md:px-12 pt-8 pb-4 flex items-center justify-between">
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

        <main className="flex-1 flex flex-col items-center justify-center px-6 md:px-12 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full max-w-xl text-center"
          >
            <div className="mb-2 flex items-center justify-center gap-3">
              <span className="w-8 h-[1px] bg-white/10" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-white/20 uppercase">{station.category}</span>
              <span className="w-8 h-[1px] bg-white/10" />
            </div>

            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-paper leading-[0.9] tracking-tight mb-4 drop-shadow-2xl">
              {station.name}
            </h1>
            <p className="text-base md:text-xl text-white/40 font-light mb-2 max-w-lg mx-auto">{station.tagline}</p>
            <p className="text-sm text-white/20 max-w-md mx-auto mb-8">{station.description}</p>

            <div className="inline-flex items-center gap-2.5 rounded-full bg-white/5 border border-white/10 px-5 py-2.5 mb-10 backdrop-blur-md">
              <Headphones size={14} className="text-amber" />
              <span className="text-xs font-mono text-white/50">{formatListeners(station.listeners)} listening</span>
              <span className="w-1 h-1 rounded-full bg-coral animate-pulse" />
            </div>

            <div className="mb-8">
              <RadioPlayer
                playlistId={station.youtubePlaylistId}
                onStateChange={setIsPlaying}
                onTrackChange={setCurrentTrack}
                onError={() => {}}
              />
            </div>

            <div className="flex items-center justify-center gap-6 mb-8">
              <Equalizer isPlaying={isPlaying} />
            </div>

            <div className="mb-8">
              <p className="text-xs font-mono text-white/20">{isPlaying ? 'NOW PLAYING' : 'READY'}</p>
              <h3 className="font-serif text-xl text-white font-medium mt-1">{currentTrack.title}</h3>
              <p className="text-sm text-white/30">{currentTrack.artist}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {station.tags.map((tag) => (
                <span key={tag} className="text-[10px] uppercase tracking-widest text-white/20 bg-white/5 border border-white/5 px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            {showShare && (
              <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-coral mt-2">Link copied to clipboard!</motion.p>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
