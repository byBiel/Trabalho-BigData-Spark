interface SectionTitleProps {
  title: string;
  subtitle: string;
}

export function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <div className="section-title">
      <span>Análise</span>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}