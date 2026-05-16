import type { ReactNode } from "react";

interface AnalysisCardProps {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  tone?: "blue" | "green" | "orange" | "red" | "purple" | "dark";
}

export function AnalysisCard({
  title,
  value,
  description,
  icon,
  tone = "blue",
}: AnalysisCardProps) {
  return (
    <article className={`analysis-card analysis-card--${tone}`}>
      <div className="analysis-card__icon">{icon}</div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
        <p>{description}</p>
      </div>
    </article>
  );
}