import { api } from "./api";
import type { ChartItem, DashboardApiData } from "../types/dashboard-api.types";

interface AreaApiResponse {
  Área: string;
  count: number;
}

interface SentimentApiResponse {
  sentimento: string;
  count: number;
}

interface CompanyApiResponse {
  "Nome Fantasia": string;
  count: number;
}

interface ProblemApiResponse {
  Problema: string;
  count: number;
}

interface UfApiResponse {
  UF: string;
  count: number;
}

function normalizeName(value: string | null | undefined) {
  return String(value ?? "").trim();
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
    name: normalizeName(item["Área"]),
    count: Number(item.count ?? 0),
  }));
}

function normalizeSentiments(response: unknown): ChartItem[] {
  const data = getArrayFromResponse<SentimentApiResponse>(response);

  return data.map((item) => ({
    name: normalizeName(item.sentimento),
    count: Number(item.count ?? 0),
  }));
}

function normalizeCompanies(response: unknown): ChartItem[] {
  const data = getArrayFromResponse<CompanyApiResponse>(response);

  return data.map((item) => ({
    name: normalizeName(item["Nome Fantasia"]),
    count: Number(item.count ?? 0),
  }));
}

function normalizeProblems(response: unknown): ChartItem[] {
  const data = getArrayFromResponse<ProblemApiResponse>(response);

  return data.map((item) => ({
    name: normalizeName(item.Problema),
    count: Number(item.count ?? 0),
  }));
}

function normalizeUfs(response: unknown): ChartItem[] {
  const data = getArrayFromResponse<UfApiResponse>(response);

  return data.map((item) => ({
    name: normalizeName(item.UF),
    count: Number(item.count ?? 0),
  }));
}

async function getAreas(): Promise<ChartItem[]> {
  const response = await api.get<unknown>("/areas/");
  return normalizeAreas(response.data);
}

async function getSentiments(): Promise<ChartItem[]> {
  const response = await api.get<unknown>("/sentimento/");
  return normalizeSentiments(response.data);
}

async function getCompanies(): Promise<ChartItem[]> {
  const response = await api.get<unknown>("/companies/");
  return normalizeCompanies(response.data);
}

async function getProblems(): Promise<ChartItem[]> {
  const response = await api.get<unknown>("/problems/");
  return normalizeProblems(response.data);
}

async function getUfs(): Promise<ChartItem[]> {
  const response = await api.get<unknown>("/uf/");
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
    topAreas: areas,
    bottomAreas: areas,
    averageAreas: areas,

    sentiments,
    topSentiments: sentiments,
    bottomSentiments: sentiments,
    averageSentiments: sentiments,

    companies,
    topCompanies: companies,
    bottomCompanies: companies,
    averageCompanies: companies,

    problems,
    topProblems: problems,
    bottomProblems: problems,
    averageProblems: problems,

    ufs,
    topUfs: ufs,
    bottomUfs: ufs,
    averageUfs: ufs,
  };
}