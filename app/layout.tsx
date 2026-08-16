import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '9to5 Radio — The Soundtrack of Your Workday',
  description:
    'Discover radio stations for every mood, meeting, commute, deadline and break of corporate life.',
  openGraph: {
    title: '9to5 Radio — The Soundtrack of Your Workday',
    description:
      'Discover radio stations for every mood, meeting, commute, deadline and break of corporate life.',
    siteName: '9to5 Radio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '9to5 Radio — The Soundtrack of Your Workday',
    description:
      'Discover radio stations for every mood, meeting, commute, deadline and break of corporate life.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ink text-paper antialiased selection:bg-amber/25 selection:text-paper">
        <div className="relative min-h-screen overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[60%] opacity-[0.03] bg-gradient-to-br from-amber via-coral to-transparent rounded-full blur-[120px]" />
            <div className="absolute bottom-[-30%] right-[-20%] w-[120%] h-[80%] opacity-[0.02] bg-gradient-to-tl from-steel via-sage to-transparent rounded-full blur-[140px]" />
          </div>
          <main className="relative z-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
