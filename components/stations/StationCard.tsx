import Link from 'next/link';
import { ArrowRight, Sparkles, Heart } from 'lucide-react';
import { stations } from '@/data/stations';
import { formatListeners } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function StationCard({ station, index }: { station: typeof stations[0]; index: number }) {
  return (
    <Link href={`/station/${station.slug}`} className="group relative block overflow-hidden rounded-2xl aspect-[4/5] md:aspect-[3/4] shadow-2xl shadow-black/40">
      <img
        src={station.artwork}
        alt={station.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/10 to-ink/60" />

      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/80 border border-white/10">
          {station.mood}
        </span>
        <span className="text-[10px] font-mono text-white/50">{formatListeners(station.listeners)} listening</span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: station.accentColor }} />
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">{station.category}</span>
        </div>
        <h3 className="text-xl md:text-2xl font-serif font-bold text-white leading-tight mb-2 group-hover:text-amber transition-colors">
          {station.name}
        </h3>
        <p className="text-sm text-white/50 leading-relaxed line-clamp-2">{station.tagline}</p>
        <div className="mt-4 flex items-center gap-2 text-xs text-amber/80 font-medium opacity-0 group-hover:opacity-100 transition-opacity translate-y-1 group-hover:translate-y-0 duration-300">
          <span>Listen now</span>
          <ArrowRight size={12} />
        </div>
      </div>
    </Link>
  );
}
