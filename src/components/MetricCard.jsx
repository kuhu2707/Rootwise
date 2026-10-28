export function MetricCard({ label, value, foot, tone = 'coral', active = false, onClick }) {
  const Card = onClick ? 'button' : 'div';
  return (
    <Card
      className={`kpi-card ${active ? 'kpi-card-active' : ''} ${onClick ? 'kpi-card-clickable' : ''}`}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      <div className="kpi-card-head">
        <span className={`kpi-dot kpi-dot-${tone}`} />
        <span className="kpi-label">{label}</span>
      </div>
      <strong className={`kpi-value ${tone === 'purple' ? 'kpi-value-text' : ''}`}>{value}</strong>
      <div className="kpi-foot">{foot}</div>
    </Card>
  );
}
