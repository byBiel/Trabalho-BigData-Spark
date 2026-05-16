import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import type { ChartItem } from "../types/dashboard-api.types";
import { formatNumber } from "../utils/dashboard.helpers";

interface DonutChartProps {
  data: ChartItem[];
  height?: number;
}

const COLORS: Record<string, string> = {
  POSITIVO: "#16a34a",
  NEUTRO: "#64748b",
  NEGATIVO: "#dc2626",
};

export function DonutChart({ data, height = 300 }: DonutChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="name"
          innerRadius={70}
          outerRadius={105}
          paddingAngle={4}
          label
        >
          {data.map((item) => (
            <Cell
              key={item.name}
              fill={COLORS[item.name.toUpperCase()] ?? "#2563eb"}
            />
          ))}
        </Pie>

        <Tooltip
          formatter={(value) => [formatNumber(Number(value)), "Reclamações"]}
        />

        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}