import { Play, Pause } from 'lucide-react';

export default function Equalizer({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="flex items-end gap-[3px] h-7">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={`w-1 rounded-full bg-gradient-to-t from-amber/50 to-coral transition-all duration-300 ${
            isPlaying ? 'animate-pulse-slow' : 'h-1'
          }`}
          style={{
            animationDelay: isPlaying ? `${i * 0.15}s` : '0s',
            height: isPlaying ? `${10 + (i + 1) * 5}px` : '4px',
          }}
        />
      ))}
    </div>
  );
}
