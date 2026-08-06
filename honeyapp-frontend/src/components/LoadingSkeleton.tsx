export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="card skeleton-card">
          <div className="skeleton skeleton-image" />
          <div className="skeleton skeleton-line short" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line medium" />
          <div className="skeleton skeleton-button" />
        </div>
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="detail-page" aria-hidden="true">
      <div className="skeleton skeleton-image detail" />
      <div className="skeleton skeleton-line short" />
      <div className="skeleton skeleton-line title" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line medium" />
    </div>
  );
}
