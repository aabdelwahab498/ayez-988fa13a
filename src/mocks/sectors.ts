import type { Sector, SectorSlug } from "@/core/types";

export const sectors: Sector[] = [
  {
    slug: "services",
    name: "الخدمات المنزلية والفنية",
    shortName: "خدمات",
    icon: "Wrench",
    description: "سباكة وكهرباء وتكييف ونقل عفش وتنظيف بجميع المحافظات",
    searchLabel: "نوع الخدمة",
  },
  {
    slug: "medical",
    name: "العيادات والرعاية الصحية",
    shortName: "طبي",
    icon: "Stethoscope",
    description: "عيادات وأطباء ومعامل ومراكز أشعة حسب التخصص الطبي",
    searchLabel: "التخصص الطبي",
  },
  {
    slug: "stores",
    name: "المتاجر والأنشطة المحلية",
    shortName: "متاجر",
    icon: "Store",
    description: "محلات وسوبر ماركت وصيدليات ومعارض في منطقتك",
    searchLabel: "نوع المنتج",
  },
  {
    slug: "transport",
    name: "النقل والشحن واللوجستيات",
    shortName: "نقل",
    icon: "Truck",
    description: "شركات نقل بضائع وشحن وتأجير سيارات ونقل مدرسي",
    searchLabel: "نوع النقل",
  },
  {
    slug: "professional",
    name: "الخدمات المهنية والاستشارية",
    shortName: "مهني",
    icon: "Briefcase",
    description: "محاماة ومحاسبة وهندسة وتسويق وترجمة معتمدة",
    searchLabel: "نوع الاستشارة",
  },
];

export const sectorBySlug = (slug?: string): Sector | undefined =>
  sectors.find((s) => s.slug === slug);

export const isSectorSlug = (value?: string): value is SectorSlug =>
  sectors.some((s) => s.slug === value);
