import { ChevronRight } from 'lucide-react';

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }) {
  return <button className={`button button-${variant} button-${size} ${className}`} {...props}>{children}</button>;
}

export function BrandMark({ compact = false }) {
  return (
    <div className={`brand-lockup ${compact ? 'brand-compact' : ''}`} aria-label="Rootwise">
      <span className="brand-symbol" aria-hidden="true"><span /><span /><span /></span>
      {!compact && <span className="brand-wordmark">Rootwise</span>}
    </div>
  );
}

export function StatusBadge({ tone = 'neutral', children }) {
  return <span className={`status-badge status-${tone}`}><span className="status-dot" />{children}</span>;
}

export function Breadcrumb({ items }) {
  return <div className="breadcrumbs">{items.map((item, index) => <span key={`${item}-${index}`}>{index > 0 && <ChevronRight size={13} />}<span className={index === items.length - 1 ? 'breadcrumb-current' : ''}>{item}</span></span>)}</div>;
}
