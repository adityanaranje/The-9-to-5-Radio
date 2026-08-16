import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center px-6 text-center">
      <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-amber/10 to-coral/10 flex items-center justify-center border border-amber/10">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /><line x1="4.93" y1="19.07" x2="19.07" y2="4.93" /></svg>
      </div>
      <h1 className="font-serif text-7xl md:text-9xl font-bold text-paper mb-2 tracking-tighter">404</h1>
      <p className="text-xl text-white/20 mb-2">Page not found.</p>
      <p className="text-sm text-white/10 mb-10">Even the best stations go off the air sometimes.</p>
      <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-amber hover:bg-amber/90 text-ink font-bold px-8 py-4 transition-colors shadow-xl shadow-amber/10">
        Return to 9to5 Radio
      </Link>
    </div>
  );
}
