export interface ChartItem {
  name: string;
  count: number;
}

export interface DashboardApiData {
  areas: ChartItem[];
  topAreas: ChartItem[];
  bottomAreas: ChartItem[];
  averageAreas: ChartItem[];

  sentiments: ChartItem[];
  topSentiments: ChartItem[];
  bottomSentiments: ChartItem[];
  averageSentiments: ChartItem[];

  companies: ChartItem[];
  topCompanies: ChartItem[];
  bottomCompanies: ChartItem[];
  averageCompanies: ChartItem[];

  problems: ChartItem[];
  topProblems: ChartItem[];
  bottomProblems: ChartItem[];
  averageProblems: ChartItem[];

  ufs: ChartItem[];
  topUfs: ChartItem[];
  bottomUfs: ChartItem[];
  averageUfs: ChartItem[];
}

export interface AreaApiResponse {
  area: string;
  total: number;
}

export interface SentimentApiResponse {
  sentimento: string;
  total: number;
}

export interface CompanyApiResponse {
  empresa: string;
  total: number;
}

export interface ProblemApiResponse {
  problema: string;
  total: number;
}

export interface UfApiResponse {
  uf: string;
  total: number;
}