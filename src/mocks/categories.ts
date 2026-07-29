import type { Category } from "@/core/types";

export const categories: Category[] = [
  {
    id: "1",
    name: "سباكة",
    slug: "plumbing",
    icon: "Wrench",
    description: "إصلاح تسريبات، تركيب أدوات صحية، وشبكات المياه",
    providersCount: 128,
  },
  {
    id: "2",
    name: "كهرباء",
    slug: "electrical",
    icon: "Zap",
    description: "تأسيس وصيانة الكهرباء ولوحات التوزيع والإنارة",
    providersCount: 143,
  },
  {
    id: "3",
    name: "تكييف",
    slug: "hvac",
    icon: "Wind",
    description: "تركيب وصيانة وتنظيف أجهزة التكييف بجميع الأنواع",
    providersCount: 96,
  },
  {
    id: "4",
    name: "نقل عفش",
    slug: "moving",
    icon: "Truck",
    description: "نقل وفك وتركيب الأثاث داخل وخارج المحافظة",
    providersCount: 74,
  },
  {
    id: "5",
    name: "تنظيف",
    slug: "cleaning",
    icon: "Sparkles",
    description: "تنظيف شقق وفيلات ومكاتب وتنظيف ما بعد التشطيب",
    providersCount: 111,
  },
  {
    id: "6",
    name: "دهانات",
    slug: "painting",
    icon: "PaintRoller",
    description: "دهانات حديثة، ورق حائط، ومعالجة الحوائط",
    providersCount: 68,
  },
  {
    id: "7",
    name: "صيانة أجهزة",
    slug: "appliances",
    icon: "Settings",
    description: "صيانة غسالات وثلاجات وأفران وسخانات",
    providersCount: 89,
  },
  {
    id: "8",
    name: "نجارة",
    slug: "carpentry",
    icon: "Hammer",
    description: "تفصيل وتركيب المطابخ والأبواب وإصلاح الأثاث",
    providersCount: 57,
  },
];

export const categoryBySlug = (slug?: string) =>
  categories.find((c) => c.slug === slug);
