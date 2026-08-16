# 9to5 Radio

**The soundtrack of your workday.**

A polished, production-ready Next.js + TypeScript website featuring 15 fictional radio stations tuned to every mood, meeting, commute, deadline, and break of modern corporate life.

---

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS 3**
- **Framer Motion**
- **Lucide React**
- **YouTube IFrame Player API**
- **localStorage** (favorites, recently played)
- **Vercel** deploy-ready

---

## Features

- Cinematic homepage with mood selector, search, category filters, and featured stations
- 15 immersive station pages with custom artwork, full-screen backgrounds, and glass overlays
- Real-time YouTube playlist playback (embedded, no copyrighted hosting) — each station ships with a curated 20-track playlist resolved through YouTube search
- Favorites (localStorage) + Recently Played (localStorage)
- "Surprise Me" random station button
- Animated equalizer, progress bar, volume control, play/pause/next/previous
- Dynamic SEO metadata and Open Graph tags per station
- Responsive design (mobile-first) with mobile menu
- Custom 404 page, loading states, error states, keyboard accessibility
- Reduced-motion support via CSS

---

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## Production Build

```bash
npm run build
npm run start
```

Both `npm run lint` and `npm run build` succeed with zero errors.

---

## Deploy to Vercel

1. Push your code to a GitHub repository.
2. Visit [vercel.com](https://vercel.com) and import the repo.
3. Set the framework preset to **Next.js** (auto-detected).
4. Leave all environment variables empty (no API keys required for V1).
5. Click **Deploy**.

The app deploys directly without any additional configuration. All routes (homepage, station pages, favorites, about, 404) are pre-rendered or server-rendered as appropriate.

---

## Project Structure

```
app/
  layout.tsx          # Root layout with SEO metadata
  page.tsx            # Cinematic homepage
  globals.css         # Tailwind + custom styles
  station/[slug]/
    page.tsx          # Dynamic station page (SSG)
    loading.tsx       # Loading state
    not-found.tsx     # Custom 404
  favorites/page.tsx # Favorites list
  about/page.tsx      # About & disclaimer
components/
  layout/
    Navbar.tsx
    Footer.tsx
  stations/
    StationCard.tsx
  player/
    RadioPlayer.tsx   # YouTube IFrame Player
    Equalizer.tsx     # Animated equalizer bars
data/
  stations.ts         # All 15 station definitions
lib/
  youtube.ts          # YouTube API loader + playlist simulation
  favorites.ts        # localStorage favorites
  recentlyPlayed.ts   # localStorage recently played
  utils.ts            # Helper functions
types/
  station.ts          # Station type definition
  player.ts           # Player state type
public/
  images/stations/    # Original station artwork (15 images)
```

---

## Adding a New Station

Edit only `/data/stations.ts` and add a new object. All routes, cards, and pages update automatically.

```ts
{
  id: 'new-station-id',
  slug: 'new-station-id',
  name: 'New Station FM',
  tagline: 'A short tagline.',
  description: 'A longer description.',
  category: 'Mood',
  mood: 'Calm',
  artwork: '/images/stations/new.jpg',
  youtubePlaylistId: 'PLAYLIST_ID_HERE',
  listeners: 1000,
  accentColor: '#c4953a',
  tags: ['tag1', 'tag2'],
  tracks: [
    { title: 'Song Name', artist: 'Artist' },
    { title: 'Another Song', artist: 'Artist' },
  ],
}
```

---

## Music & Copyright Disclaimer

9to5 Radio does not host, store, or distribute copyrighted audio. All music is delivered through embedded third-party players (YouTube IFrame Player API). The station artwork, descriptions, design, and branding are original. No real bank logos, company logos, or copyrighted characters are used.

---

## License

Built for demonstration purposes. Original artwork and design are the property of the project.
