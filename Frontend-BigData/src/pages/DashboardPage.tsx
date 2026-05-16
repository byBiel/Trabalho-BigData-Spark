import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Map,
  MessageSquareWarning,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { AnalysisCard } from "../components/AnalysisCard";
import { ChartCard } from "../components/ChartCard";
import { DashboardHeader } from "../components/DashboardHeader";
import { DashboardSummaryCards } from "../components/DashboardSummaryCards";
import { DataRankingTable } from "../components/DataRankingTable";
import { DonutChart } from "../components/DonutChart";
import { HorizontalBarChart } from "../components/HorizontalBarChart";
import { SectionTitle } from "../components/SectionTitle";
import { getDashboardData } from "../services/dashboard.service";
import type { DashboardApiData } from "../types/dashboard-api.types";
import {
  formatNumber,
  formatPercent,
  getAverageCount,
  getBottomItem,
  getItemParticipation,
  getSentimentPercent,
  getTopItem,
  getTotalCount,
  takeTop,
} from "../utils/dashboard.helpers";

export function DashboardPage() {
  const [data, setData] = useState<DashboardApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await getDashboardData();

        setData(response);
      } catch (error) {
        console.error(error);
        setErrorMessage(
          "Não foi possível carregar os dados do dashboard. Verifique se a API está rodando e se o CORS está liberado.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const analysis = useMemo(() => {
    if (!data) return null;

    const totalComplaints = getTotalCount(data.areas);

    const topArea = getTopItem(data.areas);
    const bottomArea = getBottomItem(data.areas);
    const topProblem = getTopItem(data.problems);
    const topUf = getTopItem(data.ufs);

    const negativePercent = getSentimentPercent(data.sentiments, "NEGATIVO");
    const neutralPercent = getSentimentPercent(data.sentiments, "NEUTRO");
    const positivePercent = getSentimentPercent(data.sentiments, "POSITIVO");

    const topAreaParticipation = getItemParticipation(topArea, totalComplaints);
    const topUfParticipation = getItemParticipation(
      topUf,
      getTotalCount(data.ufs),
    );

    return {
      totalComplaints,
      topArea,
      bottomArea,
      topProblem,
      topUf,
      negativePercent,
      neutralPercent,
      positivePercent,
      topAreaParticipation,
      topUfParticipation,
      averageByArea: getAverageCount(data.areas),
      averageByCompany: getAverageCount(data.companies),
      averageByProblem: getAverageCount(data.problems),
      averageByUf: getAverageCount(data.ufs),
    };
  }, [data]);

  if (loading) {
    return (
      <main className="app-shell">
        <section className="loading-card">Carregando dados do dashboard...</section>
      </main>
    );
  }

  if (errorMessage || !data || !analysis) {
    return (
      <main className="app-shell">
        <section className="error-card">
          <h1>Erro ao carregar dashboard</h1>
          <p>{errorMessage || "Nenhum dado retornado pela API."}</p>
        </section>
      </main>
    );
  }

  const topAreas = takeTop(data.areas, 10);
  const topCompanies = takeTop(data.companies, 10);
  const topUfs = takeTop(data.ufs, 12);

  return (
    <main className="app-shell">
      <DashboardHeader totalRecords={analysis.totalComplaints} />

      <DashboardSummaryCards data={data} />

      <SectionTitle
        title="Visão geral dos dados"
        subtitle="Principais concentrações encontradas na base processada pelo Spark."
      />

      <section className="analysis-grid analysis-grid--three">
        <AnalysisCard
          title="Concentração principal"
          value={analysis.topArea?.name ?? "-"}
          description={`A área representa ${formatPercent(
            analysis.topAreaParticipation,
          )} do total de reclamações analisadas.`}
          icon={<TrendingUp size={22} />}
          tone="blue"
        />

        <AnalysisCard
          title="Problema mais recorrente"
          value={analysis.topProblem?.name ?? "-"}
          description={
            analysis.topProblem
              ? `Ocorrência de ${formatNumber(
                  analysis.topProblem.count,
                )} registros nessa categoria.`
              : "Sem problemas disponíveis."
          }
          icon={<MessageSquareWarning size={22} />}
          tone="red"
        />

        <AnalysisCard
          title="Menor área registrada"
          value={analysis.bottomArea?.name ?? "-"}
          description={
            analysis.bottomArea
              ? `Área com menor volume: ${formatNumber(
                  analysis.bottomArea.count,
                )} reclamações.`
              : "Sem dados disponíveis."
          }
          icon={<TrendingDown size={22} />}
          tone="purple"
        />
      </section>

      <SectionTitle
        title="Distribuição por categoria"
        subtitle="Gráficos com os agrupamentos principais da base Consumidor.gov.br."
      />

      <section className="charts-grid charts-grid--two">
        <ChartCard
          title="Top áreas"
          subtitle="Áreas com maior quantidade de reclamações"
        >
          <HorizontalBarChart
            data={topAreas}
            height={420}
            yAxisWidth={190}
            barColor="#2563eb"
          />
        </ChartCard>

        <ChartCard
          title="Sentimento dos comentários"
          subtitle="Classificação de sentimento calculada no processamento"
        >
          <DonutChart data={data.sentiments} height={420} />
        </ChartCard>
      </section>

      <section className="charts-grid charts-grid--two">
        <ChartCard
          title="Top empresas"
          subtitle="Empresas com maior volume de reclamações"
        >
          <HorizontalBarChart
            data={topCompanies}
            height={420}
            yAxisWidth={185}
            barColor="#f97316"
          />
        </ChartCard>

        <ChartCard
          title="Top UF"
          subtitle="Estados com maior quantidade de registros"
        >
          <HorizontalBarChart
            data={topUfs}
            height={420}
            yAxisWidth={55}
            barColor="#0f172a"
          />
        </ChartCard>
      </section>

      <section className="charts-grid">
        <DataRankingTable
          className="problems-ranking-table"
          title="Top problemas"
          subtitle="Problemas mais frequentes encontrados na base de reclamações"
          data={data.problems}
          limit={20}
        />
      </section>

      <SectionTitle
        title="Indicadores analíticos"
        subtitle="Leitura consolidada dos principais percentuais e médias dos agrupamentos."
      />

      <section className="insights-grid">
        <div className="insight-panel">
          <div className="insight-panel__header">
            <AlertTriangle size={20} />
            <h3>Leitura de sentimento</h3>
          </div>

          <div className="insight-list">
            <div>
              <span>Neutro</span>
              <strong>{formatPercent(analysis.neutralPercent)}</strong>
            </div>

            <div>
              <span>Negativo</span>
              <strong>{formatPercent(analysis.negativePercent)}</strong>
            </div>

            <div>
              <span>Positivo</span>
              <strong>{formatPercent(analysis.positivePercent)}</strong>
            </div>
          </div>

          <p>
            A maior concentração está em comentários neutros, mas o volume de
            reclamações negativas ainda é relevante para análise de criticidade.
          </p>
        </div>

        <div className="insight-panel">
          <div className="insight-panel__header">
            <BarChart3 size={20} />
            <h3>Médias por agrupamento</h3>
          </div>

          <div className="insight-list">
            <div>
              <span>Média por área</span>
              <strong>{formatNumber(Math.round(analysis.averageByArea))}</strong>
            </div>

            <div>
              <span>Média por empresa</span>
              <strong>
                {formatNumber(Math.round(analysis.averageByCompany))}
              </strong>
            </div>

            <div>
              <span>Média por problema</span>
              <strong>
                {formatNumber(Math.round(analysis.averageByProblem))}
              </strong>
            </div>

            <div>
              <span>Média por UF</span>
              <strong>{formatNumber(Math.round(analysis.averageByUf))}</strong>
            </div>
          </div>

          <p>
            Essas médias ajudam a comparar a concentração dos registros entre as
            dimensões analisadas.
          </p>
        </div>

        <div className="insight-panel">
          <div className="insight-panel__header">
            <Map size={20} />
            <h3>Concentração geográfica</h3>
          </div>

          <div className="insight-highlight">
            <span>{analysis.topUf?.name ?? "-"}</span>
            <strong>{formatPercent(analysis.topUfParticipation)}</strong>
          </div>

          <p>
            O estado com maior volume concentra uma parte significativa dos
            registros, indicando maior presença de reclamações nessa região.
          </p>
        </div>
      </section>

      <SectionTitle
        title="Tabelas de ranking"
        subtitle="Listagens detalhadas para apoio à interpretação dos dados."
      />

      <section className="tables-grid">
        <DataRankingTable
          title="Ranking de áreas"
          subtitle="Participação das áreas no total de reclamações"
          data={data.areas}
          limit={14}
        />

        <DataRankingTable
          title="Ranking de UF"
          subtitle="Distribuição dos registros por estado"
          data={data.ufs}
          limit={27}
        />
      </section>

      <section className="tables-grid">
        <DataRankingTable
          title="Ranking de empresas"
          subtitle="Empresas com maior quantidade de registros"
          data={data.companies}
          limit={20}
        />

        <DataRankingTable
          title="Ranking de sentimentos"
          subtitle="Distribuição dos registros por classificação de sentimento"
          data={data.sentiments}
          limit={3}
        />
      </section>
    </main>
  );
}