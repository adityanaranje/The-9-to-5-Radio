import Link from 'next/link';
import { Radio, Headphones, Heart, Info, Menu, X, Search } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-ink/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-amber/15 text-amber">
              <Radio size={18} strokeWidth={2} />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-coral animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-[0.2em] leading-none text-paper group-hover:text-amber transition-colors">9TO5 RADIO</span>
              <span className="text-[9px] tracking-[0.15em] text-white/30 uppercase">The soundtrack of your workday.</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <Link href="/" className="hover:text-paper transition-colors">Stations</Link>
            <Link href="/favorites" className="hover:text-paper transition-colors">Favorites</Link>
            <Link href="/about" className="hover:text-paper transition-colors">About</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-white/40 hover:text-paper transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          </div>

          <button
            className="md:hidden p-2 text-white/60 hover:text-paper"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {searchOpen && (
          <div className="pb-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                autoFocus
                type="text"
                placeholder="Search stations..."
                className="w-full rounded-xl bg-white/5 border border-white/10 px-10 py-2.5 text-sm text-paper placeholder:text-white/30 focus:outline-none focus:border-amber/40 transition-colors"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSearchOpen(false);
                    window.location.href = `/?search=${encodeURIComponent((e.target as HTMLInputElement).value)}`;
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 bg-ink/95 backdrop-blur-xl px-6 py-6 space-y-4">
          <Link href="/" onClick={() => setMobileOpen(false)} className="block text-lg text-white/80 hover:text-paper">Stations</Link>
          <Link href="/favorites" onClick={() => setMobileOpen(false)} className="block text-lg text-white/80 hover:text-paper">Favorites</Link>
          <Link href="/about" onClick={() => setMobileOpen(false)} className="block text-lg text-white/80 hover:text-paper">About</Link>
          <div className="pt-2">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Search stations..."
                className="w-full rounded-xl bg-white/5 border border-white/10 px-10 py-3 text-sm text-paper placeholder:text-white/30 focus:outline-none focus:border-amber/40"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setMobileOpen(false);
                    window.location.href = `/?search=${encodeURIComponent((e.target as HTMLInputElement).value)}`;
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
