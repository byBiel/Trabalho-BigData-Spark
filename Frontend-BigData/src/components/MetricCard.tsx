import type { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  tone?: "blue" | "green" | "orange" | "red" | "purple" | "dark";
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  tone = "blue",
}: MetricCardProps) {
  return (
    <article className={`metric-card metric-card--${tone}`}>
      <div className="metric-card__header">
        <span>{title}</span>
        <div className="metric-card__icon">{icon}</div>
      </div>

      <strong>{value}</strong>
      <small>{subtitle}</small>
    </article>
  );
}