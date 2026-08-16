import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center px-6 text-center">
      <h1 className="font-serif text-6xl md:text-8xl font-bold text-paper mb-4">404</h1>
      <p className="text-white/30 text-lg mb-8">This station is not on the air.</p>
      <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-amber text-ink font-bold px-6 py-3 hover:bg-amber/90 transition-colors">
        Back to Stations
      </Link>
    </div>
  );
}
