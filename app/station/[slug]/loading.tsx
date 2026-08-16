export default function Loading() {
  return (
    <div className="min-h-screen bg-ink flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-amber/20 border-t-amber rounded-full animate-spin mx-auto mb-6" />
        <p className="text-sm text-white/30 tracking-[0.2em]">TUNING IN...</p>
      </div>
    </div>
  );
}
