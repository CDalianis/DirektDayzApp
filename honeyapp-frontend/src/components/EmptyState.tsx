import type { ReactNode } from 'react';

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <h2 className="empty-state-title">{title}</h2>
      {description && <p className="muted">{description}</p>}
      {action && <div className="empty-state-actions">{action}</div>}
    </div>
  );
}
