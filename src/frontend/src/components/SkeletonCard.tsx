const SKELETON_KEYS = [
  "sk-a",
  "sk-b",
  "sk-c",
  "sk-d",
  "sk-e",
  "sk-f",
  "sk-g",
  "sk-h",
  "sk-i",
  "sk-j",
  "sk-k",
  "sk-l",
];

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-card rounded-2xl border border-border p-5 ${className}`}
    >
      <div className="skeleton h-5 w-3/4 rounded mb-3" />
      <div className="skeleton h-3 w-full rounded mb-2" />
      <div className="skeleton h-3 w-5/6 rounded mb-2" />
      <div className="skeleton h-3 w-2/3 rounded" />
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {SKELETON_KEYS.slice(0, count).map((key) => (
        <SkeletonCard key={key} />
      ))}
    </div>
  );
}
