import { Database } from "lucide-react";
import { formatNumber } from "../utils/dashboard.helpers";

interface DashboardHeaderProps {
  totalRecords: number;
}

export function DashboardHeader({ totalRecords }: DashboardHeaderProps) {
  return (
    <>
      <header className="topbar">
        <div className="topbar__brand">
          <div className="topbar__icon">
            <Database size={22} />
          </div>

          <div>
            <h1>Dashboard Big Data</h1>
            <p>Análise de dados do Consumidor.gov.br processados com Apache Spark</p>
          </div>
        </div>
      </header>

      <section className="hero-card">
        <div>
          <span className="eyebrow">Projeto Big Data</span>

          <h2>Análise inteligente de reclamações do Consumidor.gov.br</h2>

         </div>
        <div className="hero-card__summary">
          <strong>{formatNumber(totalRecords)}</strong>
          <span>reclamações analisadas</span>
        </div>
      </section>
    </>
  );
}