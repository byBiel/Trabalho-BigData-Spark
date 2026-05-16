import {
  AlertTriangle,
  Building2,
  Layers3,
  MapPinned,
  MessageCircleWarning,
} from "lucide-react";

import type { DashboardApiData } from "../types/dashboard-api.types";
import {
  formatNumber,
  formatPercent,
  getSentimentPercent,
  getTopItem,
  getTotalCount,
} from "../utils/dashboard.helpers";
import { MetricCard } from "./MetricCard";

interface DashboardSummaryCardsProps {
  data: DashboardApiData;
}

export function DashboardSummaryCards({ data }: DashboardSummaryCardsProps) {
  const total = getTotalCount(data.areas);

  const topArea = getTopItem(data.areas);
  const topCompany = getTopItem(data.companies);
  const topUf = getTopItem(data.ufs);

  const negativePercent = getSentimentPercent(data.sentiments, "NEGATIVO");

  return (
    <section className="metrics-grid">
      <MetricCard
        title="Total de reclamações"
        value={formatNumber(total)}
        subtitle="Soma geral das áreas analisadas"
        icon={<Layers3 size={20} />}
        tone="blue"
      />

      <MetricCard
        title="Área mais recorrente"
        value={topArea?.name ?? "-"}
        subtitle={
          topArea
            ? `${formatNumber(topArea.count)} reclamações`
            : "Sem dados disponíveis"
        }
        icon={<MessageCircleWarning size={20} />}
        tone="purple"
      />

      <MetricCard
        title="Empresa com mais registros"
        value={topCompany?.name ?? "-"}
        subtitle={
          topCompany
            ? `${formatNumber(topCompany.count)} reclamações`
            : "Sem dados disponíveis"
        }
        icon={<Building2 size={20} />}
        tone="orange"
      />

      <MetricCard
        title="UF com maior volume"
        value={topUf?.name ?? "-"}
        subtitle={
          topUf
            ? `${formatNumber(topUf.count)} reclamações`
            : "Sem dados disponíveis"
        }
        icon={<MapPinned size={20} />}
        tone="green"
      />

      <MetricCard
        title="Sentimento negativo"
        value={formatPercent(negativePercent)}
        subtitle="Participação de reclamações negativas"
        icon={<AlertTriangle size={20} />}
        tone="red"
      />
    </section>
  );
}