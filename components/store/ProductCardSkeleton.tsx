/** Grey placeholder in the shape of a product card, shown while loading. */
export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border bg-card p-4">
      <div className="mb-4 aspect-4/3 rounded-xl bg-muted" />
      <div className="mb-2 h-5 w-2/3 rounded bg-muted" />
      <div className="mb-4 h-4 w-1/3 rounded bg-muted" />
      <div className="h-9 rounded-lg bg-muted" />
    </div>
  );
}
