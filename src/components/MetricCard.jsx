import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export function MetricCard({ label, value, foot, tone = 'coral', onClick }) {
  const Card = onClick ? 'button' : 'div';
  return (
    <Card className={`result-metric ${onClick ? 'result-metric-action' : ''}`} onClick={onClick} type={onClick ? 'button' : undefined}>
      <div className={`result-metric-dot metric-${tone}`} />
      <span className="result-metric-label">{label}</span>
      <strong>{value}</strong>
      <small>{foot}</small>
      {tone === 'coral' ? <ArrowUpRight size={14} className="metric-trend" /> : tone === 'green' ? <ArrowDownRight size={14} className="metric-trend" /> : null}
    </Card>
  );
}
