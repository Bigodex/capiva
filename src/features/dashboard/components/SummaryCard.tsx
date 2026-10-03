type SummaryCardProps = {
  title: string;
  value: string;
  description?: string;
};

export function SummaryCard({
  title,
  value,
  description,
}: SummaryCardProps) {
  return (
    <div className="summary-card">
      <span className="summary-card__title">{title}</span>

      <strong className="summary-card__value">
        {value}
      </strong>

      {description && (
        <span className="summary-card__description">
          {description}
        </span>
      )}
    </div>
  );
}