import { Radio, ShieldCheck, Headphones } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ink">
      <div className="mx-auto max-w-4xl px-6 md:px-10 pt-28 pb-20">
        <h1 className="font-serif text-5xl md:text-7xl font-bold text-paper mb-6 leading-[0.92] tracking-tight">About 9to5 Radio</h1>
        <div className="w-16 h-[2px] bg-gradient-to-r from-amber to-coral mb-10" />
        <div className="prose prose-invert max-w-none text-white/40 leading-relaxed space-y-6">
          <p className="text-xl md:text-2xl text-white/60 font-light">
            9to5 Radio is an unofficial soundtrack for modern work life. From the first chai break to the final deployment, every workday has a mood.
          </p>
          <p>
            We created 15 fictional radio stations — each one tuned to a different moment in the corporate experience. Whether you are surviving Monday, celebrating salary day, or quietly resigning, there is a station playing exactly the right frequency.
          </p>
          <p>
            There is no database. There are no user accounts. Music comes from embedded third-party services. We simply provide the theme, the artwork, and the playlist — the rest is your workday, playing in the background.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-6">
              <Radio size={20} className="text-amber mb-4" />
              <h3 className="text-paper font-bold mb-2">15 Stations</h3>
              <p className="text-sm text-white/20">From calm to crisis, from morning commute to late-night deployment.</p>
            </div>
            <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-6">
              <Headphones size={20} className="text-coral mb-4" />
              <h3 className="text-paper font-bold mb-2">No Accounts</h3>
              <p className="text-sm text-white/20">Favorites and recently played are stored locally in your browser.</p>
            </div>
            <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-6">
              <ShieldCheck size={20} className="text-sage mb-4" />
              <h3 className="text-paper font-bold mb-2">Embedded Music</h3>
              <p className="text-sm text-white/20">All audio is delivered through embedded third-party players. We do not host copyrighted music.</p>
            </div>
          </div>
          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-amber/5 to-coral/5 border border-amber/10">
            <h3 className="text-paper font-bold mb-2">Disclaimer</h3>
            <p className="text-sm text-white/20">
              9to5 Radio does not host, store, or distribute any copyrighted audio content. All music is delivered through embedded third-party services (e.g., YouTube). The artwork, station descriptions, and design are original and created for this project. No real bank logos, company logos, or copyrighted characters are used in any station artwork.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
