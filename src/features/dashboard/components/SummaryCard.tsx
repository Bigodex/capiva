import type { LucideIcon } from "lucide-react";

type SummaryCardProps = {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  tone?: "neutral" | "income" | "expense" | "savings";
};

export function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  tone = "neutral",
}: SummaryCardProps) {
  return (
    <div className={`summary-card summary-card--${tone}`}>
      <div className="summary-card__top">
        <span className="summary-card__icon">
          <Icon size={20} strokeWidth={2} />
        </span>

        <span className="summary-card__title">{title}</span>
      </div>

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