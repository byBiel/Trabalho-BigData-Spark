import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ChartItem } from "../types/dashboard-api.types";
import { formatNumber } from "../utils/dashboard.helpers";

interface HorizontalBarChartProps {
  data: ChartItem[];
  height?: number;
  barColor?: string;
  yAxisWidth?: number;
}

export function HorizontalBarChart({
  data,
  height = 360,
  barColor = "#2563eb",
  yAxisWidth = 160,
}: HorizontalBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis
          type="number"
          tickFormatter={(value) => formatNumber(Number(value))}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={yAxisWidth}
          tick={{ fontSize: 11 }}
        />
        <Tooltip
          formatter={(value) => [formatNumber(Number(value)), "Reclamações"]}
        />
        <Bar dataKey="count" fill={barColor} radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}