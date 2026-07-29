/** Analytics — dashboard metrics, KPIs and reports. */
import type { IsoDateTime, ListQueryContract, Uuid } from "./envelope";

export type MetricTrendContract = "up" | "down" | "flat";

export interface MetricContract {
  key: string;
  label: { ar: string; en: string };
  value: number;
  /** Percentage delta vs the previous comparable period. */
  changePct: number | null;
  trend: MetricTrendContract;
  format: "number" | "currency" | "percent" | "duration_minutes" | "rating";
}

export interface TimeSeriesPointContract {
  bucket: IsoDateTime;
  value: number;
}

export interface TimeSeriesContract {
  key: string;
  label: { ar: string; en: string };
  granularity: "hour" | "day" | "week" | "month";
  points: TimeSeriesPointContract[];
}

export interface BreakdownContract {
  key: string;
  label: { ar: string; en: string };
  rows: Array<{ label: string; value: number; share: number }>;
}

export interface AnalyticsQueryContract {
  from?: IsoDateTime;
  to?: IsoDateTime;
  granularity?: "hour" | "day" | "week" | "month";
  governorate?: string;
  sector?: string;
  compareToPrevious?: boolean;
}

/** Public marketplace counters used on the landing page. */
export interface MarketplaceMetricsContract {
  providerCount: number;
  categoryCount: number;
  governorateCount: number;
  completedRequests: number;
  averageRating: number;
  averageResponseMinutes: number;
}

export interface AdminDashboardContract {
  metrics: MetricContract[];
  series: TimeSeriesContract[];
  breakdowns: BreakdownContract[];
  alerts: Array<{ level: "info" | "warning" | "critical"; message: string }>;
}

export interface ProviderDashboardContract {
  providerId: Uuid;
  metrics: MetricContract[];
  series: TimeSeriesContract[];
  leadFunnel: { new: number; contacted: number; quoted: number; won: number; lost: number };
  subscriptionUsage: { leadsUsed: number; leadsQuota: number | null; periodEnd: IsoDateTime };
}

export interface ReportDefinitionContract {
  key: string;
  name: { ar: string; en: string };
  description: { ar: string; en: string };
  parameters: Array<{ key: string; type: "date" | "string" | "enum"; required: boolean }>;
  exportFormats: Array<"csv" | "xlsx" | "pdf">;
}

export interface ReportListQueryContract extends ListQueryContract {
  category?: "revenue" | "growth" | "quality" | "operations";
}
