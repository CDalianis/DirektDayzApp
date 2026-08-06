export function ErrorState({
  message,
  retryLabel,
  onRetry,
}: {
  message: string;
  retryLabel: string;
  onRetry: () => void;
}) {
  return (
    <div className="error-state" role="alert">
      <p className="error">{message}</p>
      <button type="button" className="btn btn-secondary" onClick={onRetry}>
        {retryLabel}
      </button>
    </div>
  );
}
