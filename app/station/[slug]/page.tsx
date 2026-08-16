import { notFound } from 'next/navigation';
import { stations } from '@/data/stations';
import StationPageClient from './StationPageClient';

export function generateStaticParams() {
  return stations.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolved = await params;
  const station = stations.find((s) => s.slug === resolved.slug);
  if (!station) return { title: 'Station Not Found — 9to5 Radio' };
  return {
    title: `${station.name} — 9to5 Radio`,
    description: station.description,
    openGraph: {
      title: `${station.name} — 9to5 Radio`,
      description: station.description,
    },
  };
}

export default async function StationPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolved = await params;
  const station = stations.find((s) => s.slug === resolved.slug);
  if (!station) return notFound();
  return <StationPageClient station={station} />;
}
