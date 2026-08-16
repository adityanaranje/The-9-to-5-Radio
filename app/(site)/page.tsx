'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { Search, Sparkles, Heart, Clock, Play, ArrowRight, Zap, ShieldCheck, Coffee, BrainCircuit, Flame, PartyPopper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { stations } from '@/data/stations';
import { Station } from '@/types/station';
import { isFavorite, toggleFavorite } from '@/lib/favorites';
import { getRecentlyPlayed, addRecentlyPlayed } from '@/lib/recentlyPlayed';
import { formatListeners, cn } from '@/lib/utils';
import { useLiveListeners } from '@/lib/useLiveListeners';

const moods = [
  { label: 'Surviving', icon: Zap, color: '#6e8a9e' },
  { label: 'Calm', icon: Coffee, color: '#c4953a' },
  { label: 'Focused', icon: BrainCircuit, color: '#3a5a6e' },
  { label: 'Happy', icon: PartyPopper, color: '#e8a84a' },
  { label: 'Reflective', icon: ShieldCheck, color: '#8a6e5a' },
  { label: 'Upbeat', icon: Sparkles, color: '#e8774a' },
];

const categories = ['All', ...Array.from(new Set(stations.map((s) => s.category)))];

function LiveListeners({ value }: { value: number }) {
  const listeners = useLiveListeners(value);
  return <>{formatListeners(listeners)}</>;
}

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [recent, setRecent] = useState<Station[]>([]);
  const [favorites, setFavorites] = useState<Station[]>([]);
  const [surprise, setSurprise] = useState<string | null>(null);

  useEffect(() => {
    setRecent(getRecentlyPlayed());
    setFavorites(stations.filter((s) => isFavorite(s.id)));
  }, []);

  const filtered = useMemo(() => {
    return stations.filter((s) => {
      const matchesSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
      const matchesMood = !selectedMood || s.mood.toLowerCase().includes(selectedMood.toLowerCase());
      return matchesSearch && matchesCategory && matchesMood;
    });
  }, [search, selectedCategory, selectedMood]);

  const handleFavorite = (station: Station) => {
    const next = toggleFavorite(station);
    setFavorites(stations.filter((s) => next.some((f) => f.id === s.id)));
  };

  const handleSurprise = () => {
    const random = stations[Math.floor(Math.random() * stations.length)];
    setSurprise(random.slug);
    setTimeout(() => setSurprise(null), 2000);
  };

  const handlePlayStation = (station: Station) => {
    addRecentlyPlayed(station);
    setRecent(getRecentlyPlayed());
    window.location.href = `/station/${station.slug}`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/stations/office-commute.jpg"
            alt=""
            className="w-full h-full object-cover opacity-[0.15] blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/80 to-ink" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 md:px-10 pt-24 md:pt-36 pb-16 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 mb-8 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-coral animate-pulse" />
              <span className="text-[11px] font-medium tracking-[0.15em] text-white/50 uppercase">Internet Radio for Corporate Life</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-paper leading-[0.92] tracking-tight mb-6">
              What kind of <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber to-coral">workday</span> are you having?
            </h1>
            <p className="text-lg md:text-xl text-white/30 max-w-xl leading-relaxed mb-10">
              16 fictional radio stations for every mood, meeting, commute, deadline and break of your corporate life. No database. Just you, the station, and the soundtrack.
            </p>

            {/* Search */}
            <div className="relative max-w-lg mb-8">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search stations, moods, tags..."
                className="w-full rounded-2xl bg-white/5 border border-white/10 pl-12 pr-4 py-4 text-sm text-paper placeholder:text-white/20 focus:outline-none focus:border-amber/40 focus:bg-white/[0.07] transition-all shadow-lg shadow-black/20"
              />
            </div>

            {/* Mood buttons */}
            <div className="flex flex-wrap gap-2.5">
              {moods.map((m) => {
                const Icon = m.icon;
                const active = selectedMood === m.label;
                return (
                  <button
                    key={m.label}
                    onClick={() => setSelectedMood(active ? null : m.label)}
                    className={cn(
                      "flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium border transition-all duration-300",
                      active
                        ? 'bg-white text-ink border-white shadow-lg shadow-white/10'
                        : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
                    )}
                  >
                    <Icon size={13} style={{ color: active ? '#18181b' : m.color }} />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured / Surprise */}
      <section className="mx-auto max-w-7xl px-6 md:px-10 -mt-8 mb-16">
        <div className="rounded-3xl overflow-hidden relative h-[320px] md:h-[400px] shadow-2xl shadow-black/40">
          <img src="/images/stations/deep-work.jpg" alt="Featured" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/50 to-transparent" />
          <div className="absolute inset-0 flex items-center px-8 md:px-14">
            <div className="max-w-md">
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-paper mb-3">Deep Work FM</h2>
              <p className="text-white/50 text-sm md:text-base mb-6">No notifications. No distractions. Just flow. A station built for total immersion.</p>
              <div className="flex gap-3">
                <Link href="/station/deep-work-fm" className="inline-flex items-center gap-2 rounded-xl bg-amber hover:bg-amber/90 text-ink font-bold text-sm px-6 py-3 transition-colors shadow-lg shadow-amber/20">
                  <Play size={16} fill="currentColor" /> Listen Now
                </Link>
                <button
                  onClick={handleSurprise}
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 text-paper font-medium text-sm px-6 py-3 border border-white/10 transition-colors backdrop-blur-sm"
                >
                  <Sparkles size={16} /> Surprise Me
                </button>
              </div>
              {surprise && (
                <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-coral mt-4">Surprise: opening station...</motion.p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Recently Played */}
      {recent.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 md:px-10 mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Clock size={16} className="text-amber" />
            <h3 className="text-xs font-bold tracking-[0.25em] text-white/20 uppercase">Recently Played</h3>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
            {recent.map((station) => (
              <Link
                key={station.id}
                href={`/station/${station.slug}`}
                className="snap-start shrink-0 flex items-center gap-4 rounded-2xl bg-white/[0.03] border border-white/5 p-4 hover:bg-white/[0.06] hover:border-white/10 transition-all w-[320px] md:w-[380px] group"
              >
                <img src={station.artwork} alt={station.name} className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-lg" />
                <div className="min-w-0">
                  <h4 className="font-serif font-bold text-paper text-sm truncate group-hover:text-amber transition-colors">{station.name}</h4>
                  <p className="text-[11px] text-white/30 truncate">{station.tagline}</p>
                  <span className="inline-block mt-2 text-[10px] font-mono text-amber/70">{station.mood}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Category filters */}
      <section className="mx-auto max-w-7xl px-6 md:px-10 mb-6">
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          <span className="text-xs font-bold tracking-[0.2em] text-white/20 uppercase shrink-0">Categories</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'rounded-full px-4 py-1.5 text-xs font-medium border transition-all duration-300 shrink-0',
                selectedCategory === cat
                  ? 'bg-paper text-ink border-paper'
                  : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white/70'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Station Grid */}
      <section className="mx-auto max-w-7xl px-6 md:px-10 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((station, i) => (
              <motion.div
                key={station.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <Link
                  href={`/station/${station.slug}`}
                  onClick={() => handlePlayStation(station)}
                  className="group relative block overflow-hidden rounded-3xl aspect-[4/5] md:aspect-[3/4] shadow-2xl shadow-black/40"
                >
                  <img
                    src={station.artwork}
                    alt={station.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/5 to-ink/50" />

                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/10 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/70 border border-white/5">
                      {station.mood}
                    </span>
                    <span className="text-[10px] font-mono text-white/40 bg-black/20 px-2 py-0.5 rounded-full backdrop-blur-sm"><LiveListeners value={station.listeners} /></span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: station.accentColor }} />
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">{station.category}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white leading-tight mb-3 group-hover:text-amber transition-colors">
                      {station.name}
                    </h3>
                    <p className="text-sm text-white/50 leading-relaxed mb-4">{station.tagline}</p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleFavorite(station);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm px-3 py-1.5 text-[11px] font-medium text-white/60 hover:text-coral hover:bg-white/15 border border-white/5 transition-all"
                      >
                        <Heart size={11} fill={isFavorite(station.id) ? '#e8774a' : 'transparent'} /> Save
                      </button>
                      <span className="text-[10px] text-white/20 font-mono">{station.tags.slice(0, 2).join(' · ')}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Favorites Mini */}
      {favorites.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 md:px-10 mb-16">
          <div className="rounded-3xl bg-gradient-to-br from-charcoal to-ink border border-white/5 p-8 md:p-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Heart size={16} className="text-coral" />
                <h3 className="text-xs font-bold tracking-[0.2em] text-white/20 uppercase">Your Favorites</h3>
              </div>
              <Link href="/favorites" className="text-xs text-amber hover:text-paper transition-colors">View all →</Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {favorites.map((station) => (
                <Link key={station.id} href={`/station/${station.slug}`} className="shrink-0 group">
                  <img src={station.artwork} alt={station.name} className="w-28 md:w-36 rounded-2xl object-cover aspect-[3/4] shadow-xl shadow-black/30 group-hover:scale-[1.03] transition-transform" />
                  <h4 className="text-xs font-medium text-white/60 mt-2 truncate max-w-[9rem] group-hover:text-paper">{station.name}</h4>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
