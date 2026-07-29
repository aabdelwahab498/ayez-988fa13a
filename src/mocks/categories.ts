import type { Category, SectorSlug } from "@/core/types";

const cat = (
  id: string,
  sector: SectorSlug,
  name: string,
  slug: string,
  icon: string,
  description: string,
  providersCount: number,
): Category => ({ id, sector, name, slug, icon, description, providersCount });

export const categories: Category[] = [
  // ---- الخدمات المنزلية والفنية ----
  cat("1", "services", "سباكة", "plumbing", "Wrench", "إصلاح تسريبات، تركيب أدوات صحية، وشبكات المياه", 128),
  cat("2", "services", "كهرباء", "electrical", "Zap", "تأسيس وصيانة الكهرباء ولوحات التوزيع والإنارة", 143),
  cat("3", "services", "تكييف", "hvac", "Wind", "تركيب وصيانة وتنظيف أجهزة التكييف بجميع الأنواع", 96),
  cat("4", "services", "نقل عفش", "moving", "Truck", "نقل وفك وتركيب الأثاث داخل وخارج المحافظة", 74),
  cat("5", "services", "تنظيف", "cleaning", "Sparkles", "تنظيف شقق وفيلات ومكاتب وتنظيف ما بعد التشطيب", 111),
  cat("6", "services", "دهانات", "painting", "PaintRoller", "دهانات حديثة، ورق حائط، ومعالجة الحوائط", 68),
  cat("7", "services", "صيانة أجهزة", "appliances", "Settings", "صيانة غسالات وثلاجات وأفران وسخانات", 89),
  cat("8", "services", "نجارة", "carpentry", "Hammer", "تفصيل وتركيب المطابخ والأبواب وإصلاح الأثاث", 57),

  // ---- العيادات والرعاية الصحية ----
  cat("9", "medical", "أسنان", "dentistry", "Smile", "تجميل وتقويم وزراعة الأسنان وعلاج الجذور", 212),
  cat("10", "medical", "باطنة", "internal-medicine", "Stethoscope", "تشخيص وعلاج أمراض الباطنة والجهاز الهضمي", 176),
  cat("11", "medical", "أطفال", "pediatrics", "Baby", "متابعة نمو الأطفال والتطعيمات والحالات الطارئة", 154),
  cat("12", "medical", "جلدية وتجميل", "dermatology", "Sun", "علاج الأمراض الجلدية وجلسات الليزر والتجميل", 132),
  cat("13", "medical", "عظام", "orthopedics", "Bone", "إصابات الملاعب والكسور وجراحات المفاصل", 98),
  cat("14", "medical", "نساء وتوليد", "obgyn", "HeartPulse", "متابعة الحمل والولادة وصحة المرأة", 121),
  cat("15", "medical", "معامل تحاليل", "labs", "TestTube", "تحاليل طبية شاملة مع سحب عينات من المنزل", 87),
  cat("16", "medical", "أشعة وتشخيص", "radiology", "ScanLine", "أشعة مقطعية ورنين مغناطيسي وسونار", 64),

  // ---- المتاجر والأنشطة المحلية ----
  cat("17", "stores", "سوبر ماركت", "grocery", "ShoppingCart", "بقالة ومنتجات غذائية وتوصيل للمنازل", 340),
  cat("18", "stores", "إلكترونيات", "electronics", "Smartphone", "موبايلات ولابتوبات وأجهزة منزلية بضمان", 165),
  cat("19", "stores", "أثاث ومفروشات", "furniture", "Sofa", "غرف نوم وأنتريهات ومطابخ جاهزة وتفصيل", 112),
  cat("20", "stores", "ملابس وأزياء", "clothing", "Shirt", "ملابس رجالي وحريمي وأطفال وأحذية", 208),
  cat("21", "stores", "صيدليات", "pharmacies", "Pill", "أدوية ومستلزمات طبية وتوصيل على مدار الساعة", 190),
  cat("22", "stores", "مواد بناء", "building-materials", "Package", "أسمنت وحديد وسيراميك وأدوات صحية", 96),

  // ---- النقل والشحن ----
  cat("23", "transport", "نقل بضائع", "freight", "Truck", "نقل بضائع بين المحافظات بسيارات مغلقة ومبردة", 88),
  cat("24", "transport", "شحن دولي", "international-shipping", "Ship", "شحن جوي وبحري وتخليص جمركي", 42),
  cat("25", "transport", "ليموزين", "limousine", "Car", "سيارات مع سائق للمطار والرحلات والمناسبات", 134),
  cat("26", "transport", "نقل مدرسي", "school-transport", "Bus", "باصات مدارس وشركات باشتراك شهري", 51),
  cat("27", "transport", "تأجير سيارات", "car-rental", "KeyRound", "تأجير يومي وشهري بسائق أو بدون", 79),

  // ---- الخدمات المهنية ----
  cat("28", "professional", "محاماة", "legal", "Scale", "قضايا مدنية وتجارية وتأسيس شركات وعقود", 118),
  cat("29", "professional", "محاسبة وضرائب", "accounting", "Calculator", "إقرارات ضريبية ومراجعة حسابات وفاتورة إلكترونية", 103),
  cat("30", "professional", "هندسة وتصميم", "architecture", "Ruler", "تصميم معماري وإشراف تنفيذ ورخص بناء", 92),
  cat("31", "professional", "تسويق رقمي", "digital-marketing", "Megaphone", "إدارة صفحات وإعلانات ممولة وتحسين محركات البحث", 147),
  cat("32", "professional", "ترجمة معتمدة", "translation", "Languages", "ترجمة قانونية وطبية معتمدة من السفارات", 58),
];

export const categoryBySlug = (slug?: string) =>
  categories.find((c) => c.slug === slug);

export const categoriesBySector = (sector?: string) =>
  sector ? categories.filter((c) => c.sector === sector) : categories;

export const sectorOfCategory = (slug?: string): SectorSlug =>
  categoryBySlug(slug)?.sector ?? "services";
