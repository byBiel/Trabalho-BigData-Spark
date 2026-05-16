import type { ChartItem } from "../types/dashboard-api.types";

export function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

export function formatPercent(value: number) {
  return `${value.toFixed(1).replace(".", ",")}%`;
}

export function getTotalCount(data: ChartItem[]) {
  return data.reduce((acc, item) => acc + item.count, 0);
}

export function getTopItem(data: ChartItem[]) {
  if (data.length === 0) return null;

  return [...data].sort((a, b) => b.count - a.count)[0];
}

export function getBottomItem(data: ChartItem[]) {
  if (data.length === 0) return null;

  return [...data].sort((a, b) => a.count - b.count)[0];
}

export function getItemParticipation(item: ChartItem | null, total: number) {
  if (!item || total === 0) return 0;

  return (item.count / total) * 100;
}

export function getAverageCount(data: ChartItem[]) {
  if (data.length === 0) return 0;

  return getTotalCount(data) / data.length;
}

export function takeTop(data: ChartItem[], limit: number) {
  return [...data].sort((a, b) => b.count - a.count).slice(0, limit);
}

export function takeBottom(data: ChartItem[], limit: number) {
  return [...data].sort((a, b) => a.count - b.count).slice(0, limit);
}

export function getSentimentCount(data: ChartItem[], sentiment: string) {
  const found = data.find(
    (item) => item.name.toUpperCase() === sentiment.toUpperCase(),
  );

  return found?.count ?? 0;
}

export function getSentimentPercent(data: ChartItem[], sentiment: string) {
  const total = getTotalCount(data);

  if (total === 0) return 0;

  return (getSentimentCount(data, sentiment) / total) * 100;
}