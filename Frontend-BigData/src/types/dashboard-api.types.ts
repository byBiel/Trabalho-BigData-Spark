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