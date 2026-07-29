import type { NotificationDTO } from "@/core/types/dto";

export const notifications: NotificationDTO[] = [
  {
    id: "n-1",
    title: "طلب جديد في القاهرة",
    body: "طلب سباكة عاجل في مدينة نصر بميزانية 600 ج.م",
    kind: "lead",
    read: false,
    createdAt: "2026-07-28T09:12:00.000Z",
    actionHref: "/provider-dashboard",
  },
  {
    id: "n-2",
    title: "تقييم جديد 5 نجوم",
    body: "أضاف العميل محمود سعيد تقييمًا جديدًا لملفك.",
    kind: "review",
    read: false,
    createdAt: "2026-07-27T15:40:00.000Z",
  },
  {
    id: "n-3",
    title: "تجديد الاشتراك",
    body: "سيتم تجديد باقة النمو تلقائيًا خلال 6 أيام.",
    kind: "billing",
    read: true,
    createdAt: "2026-07-25T08:00:00.000Z",
    actionHref: "/pricing",
  },
  {
    id: "n-4",
    title: "تحديث المنصة",
    body: "أصبح بإمكانك الآن استقبال الطلبات من محافظات إضافية.",
    kind: "system",
    read: true,
    createdAt: "2026-07-22T11:30:00.000Z",
  },
];
