import type { ChartItem } from "../types/dashboard-api.types";
import {
  formatNumber,
  formatPercent,
  getTotalCount,
} from "../utils/dashboard.helpers";

interface DataRankingTableProps {
  title: string;
  subtitle: string;
  data: ChartItem[];
  limit?: number;
  className?: string;
}

export function DataRankingTable({
  title,
  subtitle,
  data,
  limit = 10,
  className = "",
}: DataRankingTableProps) {
  const total = getTotalCount(data);
  const rows = data.slice(0, limit);

  return (
    <section className={`table-card ${className}`}>
      <div className="table-card__header">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>

        <strong>{rows.length} itens</strong>
      </div>

      <div className="ranking-table-wrapper">
        <table className="ranking-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Descrição</th>
              <th>Quantidade</th>
              <th>Participação</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((item, index) => {
              const percent = total === 0 ? 0 : (item.count / total) * 100;

              return (
                <tr key={`${item.name}-${index}`}>
                  <td className="ranking-position">{index + 1}</td>

                  <td>
                    <strong>{item.name}</strong>
                  </td>

                  <td>{formatNumber(item.count)}</td>

                  <td>
                    <div className="progress-cell">
                      <span>{formatPercent(percent)}</span>
                      <div>
                        <i style={{ width: `${Math.min(percent, 100)}%` }} />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}

            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="empty-table">
                  Nenhum dado encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}