import type { Provider, SectorSlug } from "@/core/types";

const img = (seed: string, w = 600, h = 400) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

interface Seed {
  id: string;
  sector: SectorSlug;
  name: string;
  slug: string;
  specialty: string;
  category: string;
  short: string;
  about: string;
  offers: [string, number, number | undefined, string][];
  rating: number;
  reviewsCount: number;
  verified: boolean;
  gov: string;
  city?: string;
  govLabel: string;
  nationwide?: boolean;
  responseTimeMinutes: number;
  availableNow: boolean;
  completedJobs: number;
  yearsExperience: number;
  phone: string;
  reviewText: string;
  reviewAuthor: string;
}

const build = (s: Seed): Provider => ({
  id: s.id,
  name: s.name,
  slug: s.slug,
  sector: s.sector,
  specialty: s.specialty,
  profileImage: img(s.slug, 400, 400),
  categories: [s.category],
  services: s.offers.map(([name, priceFrom, priceTo, unit], i) => ({
    id: `${s.id}-o${i}`,
    name,
    categorySlug: s.category,
    priceFrom,
    priceTo,
    unit,
  })),
  rating: s.rating,
  reviewsCount: s.reviewsCount,
  verified: s.verified,
  shortDescription: s.short,
  about: s.about,
  priceFrom: Math.min(...s.offers.map((o) => o[1])),
  priceTo: Math.max(...s.offers.map((o) => o[2] ?? o[1])),
  coverage: s.nationwide
    ? [{ scope: "nationwide", label: "متاح في جميع محافظات مصر" }]
    : [
        s.city
          ? {
              scope: "city",
              governorateSlug: s.gov,
              citySlug: s.city,
              label: `يخدم: ${s.govLabel}`,
            }
          : { scope: "governorate", governorateSlug: s.gov, label: `يخدم: ${s.govLabel}` },
      ],
  canServeNationwide: Boolean(s.nationwide),
  responseTimeMinutes: s.responseTimeMinutes,
  availableNow: s.availableNow,
  completedJobs: s.completedJobs,
  yearsExperience: s.yearsExperience,
  phone: s.phone,
  gallery: [img(`${s.slug}-1`), img(`${s.slug}-2`), img(`${s.slug}-3`)],
  reviews: [
    {
      id: `${s.id}-rv1`,
      providerId: s.id,
      authorName: s.reviewAuthor,
      rating: Math.min(5, Math.round(s.rating)),
      comment: s.reviewText,
      date: "2026-06-02",
      location: s.govLabel,
    },
  ],
});

const seeds: Seed[] = [
  // ---------- طبي ----------
  {
    id: "101", sector: "medical", name: "مركز سمايل لطب وتجميل الأسنان", slug: "smile-dental-center",
    specialty: "تجميل وزراعة الأسنان", category: "dentistry",
    short: "مركز أسنان متكامل بأحدث أجهزة التعقيم والتصوير ثلاثي الأبعاد.",
    about: "مركز طبي متخصص في تجميل وزراعة الأسنان والتقويم الشفاف، بفريق من استشاريي طب الفم والأسنان وخطة علاج واضحة بالتكلفة قبل البدء.",
    offers: [["كشف وتشخيص", 300, undefined, "للكشف"], ["حشو تجميلي", 700, 1500, "للسن"], ["زراعة سن", 9000, 16000, "للزرعة"]],
    rating: 4.9, reviewsCount: 342, verified: true, gov: "cairo", city: "new-cairo", govLabel: "القاهرة - التجمع الخامس",
    responseTimeMinutes: 20, availableNow: true, completedJobs: 4200, yearsExperience: 14, phone: "0100 998 3321",
    reviewAuthor: "ريهام مصطفى", reviewText: "دكتور شاطر جدًا والمكان نظيف والمواعيد منضبطة.",
  },
  {
    id: "102", sector: "medical", name: "د. هشام العزب - باطنة وجهاز هضمي", slug: "dr-hesham-internal",
    specialty: "أستاذ الباطنة والكبد", category: "internal-medicine",
    short: "استشاري باطنة وكبد وجهاز هضمي بخبرة 20 عامًا في المستشفيات الجامعية.",
    about: "عيادة متخصصة في أمراض الجهاز الهضمي والكبد والسكري وضغط الدم، مع خدمة المناظير في مركز مجهز ومتابعة دورية للحالات المزمنة.",
    offers: [["كشف", 450, undefined, "للكشف"], ["استشارة متابعة", 250, undefined, "للزيارة"], ["منظار معدة", 3500, 5000, "للإجراء"]],
    rating: 4.8, reviewsCount: 231, verified: true, gov: "alexandria", city: "smouha", govLabel: "الإسكندرية - سموحة",
    responseTimeMinutes: 45, availableNow: false, completedJobs: 3100, yearsExperience: 20, phone: "0122 771 4098",
    reviewAuthor: "سعيد الشناوي", reviewText: "شرح الحالة بالتفصيل والعلاج ظبط معايا من أول شهر.",
  },
  {
    id: "103", sector: "medical", name: "عيادة براعم لطب الأطفال", slug: "baraem-pediatrics",
    specialty: "أطفال وحديثي الولادة", category: "pediatrics",
    short: "متابعة نمو وتطعيمات الأطفال وحديثي الولادة مع استشارات رضاعة.",
    about: "عيادة أطفال مجهزة لاستقبال الحالات الطارئة يوميًا حتى منتصف الليل، مع برنامج تطعيمات كامل ومتابعة النمو والتغذية.",
    offers: [["كشف أطفال", 350, undefined, "للكشف"], ["تطعيم", 200, 900, "للجرعة"], ["استشارة تغذية", 300, undefined, "للجلسة"]],
    rating: 4.7, reviewsCount: 187, verified: true, gov: "giza", city: "dokki", govLabel: "الجيزة - الدقي",
    responseTimeMinutes: 30, availableNow: true, completedJobs: 2600, yearsExperience: 11, phone: "0111 442 8890",
    reviewAuthor: "نهى عبد الله", reviewText: "الدكتورة بتطمن الأم وبتتابع الطفل بجدية.",
  },
  {
    id: "104", sector: "medical", name: "معامل الدلتا للتحاليل الطبية", slug: "delta-labs",
    specialty: "تحاليل طبية وسحب عينات منزلي", category: "labs",
    short: "شبكة معامل بنتائج خلال ساعات وسحب عينات من المنزل مجانًا.",
    about: "معمل تحاليل معتمد من وزارة الصحة، يقدم باقات فحص شامل وتحاليل الحمل والهرمونات والمناعة، مع نتائج إلكترونية على الواتساب.",
    offers: [["صورة دم كاملة", 120, undefined, "للتحليل"], ["باقة فحص شامل", 900, 1800, "للباقة"], ["سحب عينة منزلي", 80, undefined, "للزيارة"]],
    rating: 4.6, reviewsCount: 410, verified: true, gov: "dakahlia", govLabel: "الدقهلية", nationwide: false,
    responseTimeMinutes: 15, availableNow: true, completedJobs: 9800, yearsExperience: 17, phone: "0106 330 1177",
    reviewAuthor: "محمود عطية", reviewText: "النتيجة وصلت في نفس اليوم والأسعار مناسبة.",
  },

  // ---------- متاجر ----------
  {
    id: "105", sector: "stores", name: "سوبر ماركت الأمانة", slug: "el-amana-market",
    specialty: "بقالة ومنتجات غذائية", category: "grocery",
    short: "سوبر ماركت شامل مع توصيل مجاني للطلبات فوق 300 جنيه.",
    about: "سوبر ماركت عائلي يوفر منتجات غذائية ومنظفات ومستلزمات منزلية بأسعار الجملة، مع خدمة توصيل يومية داخل المنطقة خلال ساعة.",
    offers: [["طلب توصيل منزلي", 300, undefined, "للطلب"], ["عروض الجملة", 1000, 5000, "للكرتونة"]],
    rating: 4.5, reviewsCount: 96, verified: false, gov: "cairo", city: "nasr-city", govLabel: "القاهرة - مدينة نصر",
    responseTimeMinutes: 25, availableNow: true, completedJobs: 5400, yearsExperience: 9, phone: "0128 654 2200",
    reviewAuthor: "إيمان رشدي", reviewText: "الأسعار كويسة والتوصيل سريع.",
  },
  {
    id: "106", sector: "stores", name: "تك بوينت للإلكترونيات", slug: "tech-point-store",
    specialty: "موبايلات ولابتوبات", category: "electronics",
    short: "وكيل معتمد لأشهر الماركات مع ضمان سنتين وتقسيط بدون فوائد.",
    about: "معرض إلكترونيات يوفر أحدث الموبايلات واللابتوبات والأجهزة الذكية بضمان الوكيل، مع خدمة صيانة داخلية وتقسيط عبر البنوك.",
    offers: [["موبايلات", 4000, 60000, "للجهاز"], ["لابتوبات", 12000, 90000, "للجهاز"], ["صيانة أجهزة", 250, 2500, "للإصلاح"]],
    rating: 4.4, reviewsCount: 158, verified: true, gov: "alexandria", city: "sidi-gaber", govLabel: "الإسكندرية - سيدي جابر",
    responseTimeMinutes: 40, availableNow: true, completedJobs: 3300, yearsExperience: 8, phone: "0109 221 7788",
    reviewAuthor: "كريم فتحي", reviewText: "اشتريت لابتوب بضمان وتعامل محترم.",
  },
  {
    id: "107", sector: "stores", name: "معرض بيتنا للأثاث", slug: "beitna-furniture",
    specialty: "غرف نوم ومطابخ", category: "furniture",
    short: "أثاث دمياطي بتصنيع خاص وتسليم خلال 30 يومًا لجميع المحافظات.",
    about: "معرض أثاث متخصص في غرف النوم والأنتريهات والمطابخ بخامات زان وأرو، مع إمكانية التفصيل حسب المقاس والتركيب المجاني.",
    offers: [["غرفة نوم كاملة", 25000, 120000, "للغرفة"], ["مطبخ خشب", 18000, 80000, "للمتر"], ["أنتريه", 12000, 45000, "للطقم"]],
    rating: 4.6, reviewsCount: 73, verified: true, gov: "damietta", govLabel: "دمياط", nationwide: true,
    responseTimeMinutes: 60, availableNow: false, completedJobs: 880, yearsExperience: 22, phone: "0127 889 4410",
    reviewAuthor: "طارق حجازي", reviewText: "خامة ممتازة والتسليم كان في الميعاد.",
  },
  {
    id: "108", sector: "stores", name: "صيدلية الشفاء 24 ساعة", slug: "elshifa-pharmacy",
    specialty: "أدوية ومستلزمات طبية", category: "pharmacies",
    short: "صيدلية مفتوحة 24 ساعة مع توصيل الأدوية خلال 30 دقيقة.",
    about: "صيدلية معتمدة توفر الأدوية النادرة ومستلزمات مرضى السكري والعناية بالبشرة، مع استشارة صيدلي مجانية وخصومات على الوصفات الشهرية.",
    offers: [["توصيل أدوية", 20, undefined, "للطلب"], ["قياس ضغط وسكر", 0, undefined, "مجانًا"]],
    rating: 4.7, reviewsCount: 264, verified: true, gov: "giza", city: "6th-october", govLabel: "الجيزة - السادس من أكتوبر",
    responseTimeMinutes: 10, availableNow: true, completedJobs: 12500, yearsExperience: 13, phone: "0100 776 5512",
    reviewAuthor: "هبة صلاح", reviewText: "وفروا لي دواء مش موجود في أي مكان، شكرًا.",
  },

  // ---------- نقل ----------
  {
    id: "109", sector: "transport", name: "شركة المصرية لنقل البضائع", slug: "masria-freight",
    specialty: "نقل بضائع بين المحافظات", category: "freight",
    short: "أسطول سيارات مغلقة ومبردة لنقل البضائع بين جميع المحافظات.",
    about: "شركة نقل بضائع مرخصة بأسطول من الدينا والتريلا والسيارات المبردة، مع تتبع الشحنة وتأمين على البضاعة وفواتير ضريبية.",
    offers: [["نقل داخل المحافظة", 1200, 3000, "للرحلة"], ["نقل بين المحافظات", 3500, 12000, "للرحلة"], ["نقل مبرد", 5000, 18000, "للرحلة"]],
    rating: 4.5, reviewsCount: 112, verified: true, gov: "cairo", govLabel: "جميع المحافظات", nationwide: true,
    responseTimeMinutes: 35, availableNow: true, completedJobs: 2400, yearsExperience: 16, phone: "0121 004 9987",
    reviewAuthor: "شريف الديب", reviewText: "الشحنة وصلت سليمة والتعامل احترافي.",
  },
  {
    id: "110", sector: "transport", name: "كايرو ليموزين", slug: "cairo-limousine",
    specialty: "ليموزين مطار ورحلات", category: "limousine",
    short: "سيارات حديثة مع سائقين محترفين لخدمة المطار والرحلات الخاصة.",
    about: "خدمة ليموزين على مدار الساعة تشمل استقبال المطار والرحلات السياحية والمناسبات، بسيارات موديلات حديثة وسائقين يتحدثون الإنجليزية.",
    offers: [["توصيل مطار", 700, 1500, "للرحلة"], ["إيجار يومي بسائق", 2200, 4500, "لليوم"], ["رحلة الساحل/الغردقة", 4500, 9000, "للرحلة"]],
    rating: 4.8, reviewsCount: 205, verified: true, gov: "cairo", govLabel: "جميع المحافظات", nationwide: true,
    responseTimeMinutes: 12, availableNow: true, completedJobs: 6700, yearsExperience: 10, phone: "0114 556 3300",
    reviewAuthor: "Mohamed A.", reviewText: "السواق كان في المطار قبل الميعاد والسيارة نضيفة.",
  },
  {
    id: "111", sector: "transport", name: "الرحاب لتأجير السيارات", slug: "rehab-car-rental",
    specialty: "تأجير سيارات بسائق أو بدون", category: "car-rental",
    short: "تأجير يومي وشهري لسيارات اقتصادية وفاخرة بتأمين شامل.",
    about: "شركة تأجير سيارات مرخصة توفر عقود يومية وشهرية للأفراد والشركات، مع صيانة دورية وتأمين شامل وبديل فوري عند الأعطال.",
    offers: [["إيجار يومي بدون سائق", 1200, 3500, "لليوم"], ["إيجار شهري", 18000, 45000, "للشهر"]],
    rating: 4.3, reviewsCount: 88, verified: false, gov: "port-said", govLabel: "بورسعيد",
    responseTimeMinutes: 50, availableNow: false, completedJobs: 1300, yearsExperience: 7, phone: "0155 220 7741",
    reviewAuthor: "أشرف زكي", reviewText: "العربية كانت بحالة ممتازة والإجراءات سريعة.",
  },

  // ---------- مهني ----------
  {
    id: "112", sector: "professional", name: "مكتب المستشار وائل جاد للمحاماة", slug: "wael-gad-law",
    specialty: "قضايا تجارية وتأسيس شركات", category: "legal",
    short: "مكتب محاماة متخصص في الشركات والعقود والتحكيم التجاري.",
    about: "مكتب محاماة يضم فريقًا من المحامين المقيدين أمام النقض، متخصص في تأسيس الشركات وصياغة العقود والقضايا التجارية والعمالية.",
    offers: [["استشارة قانونية", 500, 1500, "للجلسة"], ["تأسيس شركة", 8000, 25000, "للتأسيس"], ["صياغة عقد", 2000, 7000, "للعقد"]],
    rating: 4.7, reviewsCount: 64, verified: true, gov: "cairo", city: "downtown", govLabel: "القاهرة - وسط البلد",
    responseTimeMinutes: 90, availableNow: false, completedJobs: 420, yearsExperience: 18, phone: "0102 334 6655",
    reviewAuthor: "ماجد سليمان", reviewText: "أنهى إجراءات تأسيس الشركة بسرعة وبدون تعقيد.",
  },
  {
    id: "113", sector: "professional", name: "بي إم للمحاسبة والضرائب", slug: "pm-accounting",
    specialty: "إقرارات ضريبية وفاتورة إلكترونية", category: "accounting",
    short: "محاسبون قانونيون لإدارة الحسابات والالتزام الضريبي للشركات الصغيرة.",
    about: "مكتب محاسبة يقدم مسك الدفاتر والإقرارات الضريبية والقيمة المضافة والتسجيل في منظومة الفاتورة الإلكترونية، باشتراك شهري مرن.",
    offers: [["اشتراك شهري", 2500, 12000, "للشهر"], ["إقرار ضريبي سنوي", 4000, 15000, "للإقرار"]],
    rating: 4.6, reviewsCount: 51, verified: true, gov: "giza", govLabel: "جميع المحافظات", nationwide: true,
    responseTimeMinutes: 70, availableNow: true, completedJobs: 610, yearsExperience: 12, phone: "0120 887 3344",
    reviewAuthor: "دينا العشري", reviewText: "ظبطوا لي المنظومة الضريبية بالكامل.",
  },
  {
    id: "114", sector: "professional", name: "استوديو مدى للتصميم المعماري", slug: "mada-architecture",
    specialty: "تصميم معماري وتشطيبات", category: "architecture",
    short: "تصميم معماري وداخلي وإشراف على التنفيذ بجميع المحافظات.",
    about: "استوديو معماري يقدم التصميمات المعمارية والداخلية والرسومات التنفيذية ورخص البناء، مع إشراف هندسي أسبوعي على مواقع التنفيذ.",
    offers: [["تصميم داخلي", 250, 600, "للمتر"], ["رسومات تنفيذية", 150, 400, "للمتر"], ["إشراف على التنفيذ", 15000, 60000, "للمشروع"]],
    rating: 4.8, reviewsCount: 47, verified: true, gov: "cairo", govLabel: "جميع المحافظات", nationwide: true,
    responseTimeMinutes: 120, availableNow: false, completedJobs: 190, yearsExperience: 9, phone: "0106 991 2244",
    reviewAuthor: "أحمد بدوي", reviewText: "تصميم راقي وملتزمين بالميزانية المتفق عليها.",
  },
  {
    id: "115", sector: "professional", name: "نكست ميديا للتسويق الرقمي", slug: "next-media-marketing",
    specialty: "إعلانات ممولة وإدارة صفحات", category: "digital-marketing",
    short: "وكالة تسويق رقمي لإدارة الحملات الممولة وتحسين محركات البحث.",
    about: "وكالة تسويق رقمي تعمل مع المتاجر والعيادات والشركات المحلية على إدارة الحملات الإعلانية وصناعة المحتوى وتحسين الظهور في نتائج البحث.",
    offers: [["إدارة صفحات", 5000, 15000, "للشهر"], ["حملات إعلانية", 8000, 40000, "للشهر"], ["تحسين محركات البحث", 6000, 20000, "للشهر"]],
    rating: 4.5, reviewsCount: 79, verified: false, gov: "alexandria", govLabel: "جميع المحافظات", nationwide: true,
    responseTimeMinutes: 55, availableNow: true, completedJobs: 340, yearsExperience: 6, phone: "0115 447 8820",
    reviewAuthor: "منار سيف", reviewText: "المبيعات زادت بشكل واضح بعد أول حملة.",
  },
];

export const directoryListings: Provider[] = seeds.map(build);
