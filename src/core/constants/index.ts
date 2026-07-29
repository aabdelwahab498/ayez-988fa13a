import type { RequestStatus, SortKey } from "@/core/types";

export const APP_NAME = "دليل الخدمات";
export const APP_TAGLINE = "كل الخدمات والعيادات والمتاجر في مصر… في دليل واحد";


export const STATUS_LABELS: Record<RequestStatus, string> = {
  new: "جديد",
  in_contact: "قيد التواصل",
  completed: "مكتمل",
  cancelled: "ملغي",
};

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "rating", label: "الأعلى تقييمًا" },
  { key: "relevance", label: "الأقرب تطابقًا" },
  { key: "response", label: "الأسرع استجابة" },
  { key: "price", label: "الأقل سعرًا" },
];

export const RATING_OPTIONS = [
  { value: 0, label: "كل التقييمات" },
  { value: 3, label: "3 نجوم فأكثر" },
  { value: 4, label: "4 نجوم فأكثر" },
  { value: 4.5, label: "4.5 نجوم فأكثر" },
];

export const REQUEST_STEPS = [
  "الخدمة",
  "الموقع",
  "التفاصيل",
  "بياناتك",
  "تأكيد",
];

export const PUBLIC_NAV = [
  { to: "/", labelKey: "nav.home" },
  { to: "/services", labelKey: "nav.directory" },
  { to: "/request-service", labelKey: "nav.request" },
  { to: "/my-requests", labelKey: "nav.myRequests" },
  { to: "/pricing", labelKey: "nav.pricing" },
] as const;
