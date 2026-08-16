import Link from 'next/link';
import { Radio, Linkedin } from 'lucide-react';

const LINKEDIN_URL = process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-10 md:gap-16">
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-amber/15 text-amber">
                <Radio size={16} strokeWidth={2} />
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-coral animate-pulse" />
              </div>
              <span className="text-sm font-bold tracking-[0.2em] text-paper">9TO5 RADIO</span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              The unofficial soundtrack for modern work life. No database. Just stations, moods, and the occasional chai break.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] text-white/50 uppercase mb-4">Explore</h4>
            <div className="flex flex-col gap-2.5 text-sm text-white/70">
              <Link href="/" className="hover:text-paper transition-colors">All Stations</Link>
              <Link href="/favorites" className="hover:text-paper transition-colors">Favorites</Link>
              <Link href="/about" className="hover:text-paper transition-colors">About</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] text-white/50 uppercase mb-4">Disclaimer</h4>
            <p className="text-xs text-white/50 leading-relaxed">
              Music is provided through embedded third-party services. 9to5 Radio does not host, store, or distribute copyrighted audio. All content is the property of its respective owners.
            </p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-white/40 tracking-wide">© 2025 9to5 Radio. No copyright infringement intended.</p>
          <div className="flex items-center gap-4">
            <p className="text-[11px] text-white/40 tracking-wide">Built for workdays everywhere.</p>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-white/60 hover:text-paper transition-colors"
            >
              <Linkedin size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
