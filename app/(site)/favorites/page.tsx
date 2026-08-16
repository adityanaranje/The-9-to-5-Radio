'use client';

import Link from 'next/link';
import { Heart, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { stations } from '@/data/stations';
import { getFavorites } from '@/lib/favorites';
import { Station } from '@/types/station';

export default function FavoritesPage() {
  const [favStations, setFavStations] = useState<Station[]>([]);

  useEffect(() => {
    setFavStations(stations.filter((s) => getFavorites().some((f: Station) => f.id === s.id)));
  }, []);

  return (
    <div className="min-h-screen bg-ink">
      <div className="mx-auto max-w-7xl px-6 md:px-10 pt-28 pb-20">
        <Link href="/" className="inline-flex items-center gap-2 text-white/30 hover:text-paper mb-10 transition-colors">
          <ArrowLeft size={16} /> Back to stations
        </Link>
        <div className="flex items-center gap-3 mb-12">
          <Heart size={20} className="text-coral" />
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-paper">Your Favorites</h1>
        </div>
        {favStations.length === 0 ? (
          <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-12 text-center">
            <p className="text-white/20">No favorites yet. Pick a station and click the heart.</p>
            <Link href="/" className="inline-block mt-6 text-amber hover:text-paper transition-colors">Browse stations →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {favStations.map((station) => (
              <Link key={station.id} href={`/station/${station.slug}`} className="group block overflow-hidden rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all shadow-xl shadow-black/20">
                <div className="relative h-56 overflow-hidden">
                  <img src={station.artwork} alt={station.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: station.accentColor }} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">{station.category}</span>
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-paper group-hover:text-amber transition-colors mb-2">{station.name}</h2>
                  <p className="text-sm text-white/30">{station.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
