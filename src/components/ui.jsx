import { ChevronRight } from 'lucide-react';
import logoMark from '../assets/logo.png';

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }) {
  return <button className={`button button-${variant} button-${size} ${className}`} {...props}>{children}</button>;
}

export function BrandMark({ compact = false }) {
  return (
    <div className={`brand-lockup ${compact ? 'brand-compact' : ''}`} aria-label="Rootwise">
      <img className="brand-symbol-image" src={logoMark} alt="" aria-hidden="true" />
      {!compact && <span className="brand-wordmark">Rootwise</span>}
    </div>
  );
}

export function StatusBadge({ tone = 'neutral', children }) {
  return <span className={`status-badge status-${tone}`}><span className="status-dot" />{children}</span>;
}

export function Breadcrumb({ items }) {
  return (
    <div className="breadcrumbs">
      {items.map((item, index) => (
        <span key={`${item}-${index}`} className="breadcrumb-item">
          {index > 0 && <span className="breadcrumb-separator">/</span>}
          <span className={index === items.length - 1 ? 'breadcrumb-current' : 'breadcrumb-parent'}>{item}</span>
        </span>
      ))}
    </div>
  );
}
