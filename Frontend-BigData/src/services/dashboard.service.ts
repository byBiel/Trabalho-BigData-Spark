import { api } from "./api";

import type {
  AreaApiResponse,
  ChartItem,
  CompanyApiResponse,
  DashboardApiData,
  ProblemApiResponse,
  SentimentApiResponse,
  UfApiResponse,
} from "../types/dashboard-api.types";

function normalizeName(value: string | null | undefined): string {
  return String(value ?? "").trim();
}

function normalizeCount(value: number | string | null | undefined): number {
  const parsed = Number(value ?? 0);

  if (Number.isNaN(parsed)) {
    return 0;
  }

  return parsed;
}

function getArrayFromResponse<T>(response: unknown): T[] {
  if (Array.isArray(response)) {
    return response as T[];
  }

  console.warn("Resposta da API não é uma lista:", response);

  return [];
}

function normalizeAreas(response: unknown): ChartItem[] {
  const data = getArrayFromResponse<AreaApiResponse>(response);

  return data.map((item) => ({
    name: normalizeName(item.area),
    count: normalizeCount(item.total),
  }));
}

function normalizeSentiments(response: unknown): ChartItem[] {
  const data = getArrayFromResponse<SentimentApiResponse>(response);

  return data.map((item) => ({
    name: normalizeName(item.sentimento),
    count: normalizeCount(item.total),
  }));
}

function normalizeCompanies(response: unknown): ChartItem[] {
  const data = getArrayFromResponse<CompanyApiResponse>(response);

  return data.map((item) => ({
    name: normalizeName(item.empresa),
    count: normalizeCount(item.total),
  }));
}

function normalizeProblems(response: unknown): ChartItem[] {
  const data = getArrayFromResponse<ProblemApiResponse>(response);

  return data.map((item) => ({
    name: normalizeName(item.problema),
    count: normalizeCount(item.total),
  }));
}

function normalizeUfs(response: unknown): ChartItem[] {
  const data = getArrayFromResponse<UfApiResponse>(response);

  return data.map((item) => ({
    name: normalizeName(item.uf),
    count: normalizeCount(item.total),
  }));
}

function getTopItems(data: ChartItem[], limit = 10): ChartItem[] {
  return [...data]
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

function getBottomItems(data: ChartItem[], limit = 10): ChartItem[] {
  return [...data]
    .sort((a, b) => a.count - b.count)
    .slice(0, limit);
}

function getAverageItem(data: ChartItem[], label = "Média"): ChartItem[] {
  if (!data.length) {
    return [
      {
        name: label,
        count: 0,
      },
    ];
  }

  const total = data.reduce((sum, item) => sum + item.count, 0);
  const average = total / data.length;

  return [
    {
      name: label,
      count: Number(average.toFixed(2)),
    },
  ];
}

async function getAreas(): Promise<ChartItem[]> {
  const response = await api.get<unknown>("api/area/");
  return normalizeAreas(response.data);
}

async function getSentiments(): Promise<ChartItem[]> {
  const response = await api.get<unknown>("api/sentimento/");
  return normalizeSentiments(response.data);
}

async function getCompanies(): Promise<ChartItem[]> {
  const response = await api.get<unknown>("api/companies/");
  return normalizeCompanies(response.data);
}

async function getProblems(): Promise<ChartItem[]> {
  const response = await api.get<unknown>("api/problems/");
  return normalizeProblems(response.data);
}

async function getUfs(): Promise<ChartItem[]> {
  const response = await api.get<unknown>("api/uf/");
  return normalizeUfs(response.data);
}

export async function getDashboardData(): Promise<DashboardApiData> {
  const [areas, sentiments, companies, problems, ufs] = await Promise.all([
    getAreas(),
    getSentiments(),
    getCompanies(),
    getProblems(),
    getUfs(),
  ]);

  return {
    areas,
    topAreas: getTopItems(areas),
    bottomAreas: getBottomItems(areas),
    averageAreas: getAverageItem(areas, "Média por área"),

    sentiments,
    topSentiments: getTopItems(sentiments),
    bottomSentiments: getBottomItems(sentiments),
    averageSentiments: getAverageItem(sentiments, "Média por sentimento"),

    companies,
    topCompanies: getTopItems(companies),
    bottomCompanies: getBottomItems(companies),
    averageCompanies: getAverageItem(companies, "Média por empresa"),

    problems,
    topProblems: getTopItems(problems),
    bottomProblems: getBottomItems(problems),
    averageProblems: getAverageItem(problems, "Média por problema"),

    ufs,
    topUfs: getTopItems(ufs),
    bottomUfs: getBottomItems(ufs),
    averageUfs: getAverageItem(ufs, "Média por UF"),
  };
}