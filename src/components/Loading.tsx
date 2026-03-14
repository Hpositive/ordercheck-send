export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-24 animate-fade-in-up">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 border-[3px] border-blue-100 rounded-full" />
        <div className="absolute inset-0 border-[3px] border-transparent border-t-blue-600 rounded-full animate-spin" />
      </div>
      <p className="mt-4 text-xs text-gray-400 tracking-wide">로딩 중...</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-4 space-y-3">
      <div className="flex gap-3">
        <div className="skeleton w-14 h-14 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-3 w-32" />
          <div className="skeleton h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="px-4 py-3 space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
