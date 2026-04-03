export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-end gap-[3px] h-5">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="w-[3px] rounded-sm bg-stone-400 animate-listening-bar"
              style={{ animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </div>
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-stone-500">Loading</p>
      </div>
    </div>
  );
}
