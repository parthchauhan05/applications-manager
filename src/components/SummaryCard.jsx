import { Card } from "primereact/card";

export default function SummaryCard({ label, value, icon, tone = "primary" }) {
  return (
    <Card className={`summary-card summary-card--${tone}`}>
      <div className="summary-card__inner">
        <div>
          <div className="summary-card__label">{label}</div>
          <div className="summary-card__value">{value}</div>
        </div>
        <div className="summary-card__badge">
          <i className={`pi ${icon} summary-card__icon`} />
        </div>
      </div>
    </Card>
  );
}