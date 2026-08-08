
#  Ayez
<img width="1227" height="788" alt="image" src="https://github.com/user-attachments/assets/5f5eff24-fa42-400a-a6a8-b4dffb11d79f" />


Build a complete, polished, responsive Arabic RTL frontend for a local services marketplace named "دليل الخدمات".

The platform serves all governorates of the Arab Republic of Egypt, not one city. Its main purpose is to help customers find suitable service providers based on service type and location, then submit a service request (lead).

IMPORTANT SCOPE:

- Frontend only. Do not create a backend, database, authentication logic, Supabase integration, or real API calls.

- Use realistic mock data in separate organized files, designed to be replaced later by a Django REST API.

- Use React + TypeScript + Tailwind CSS + shadcn/ui.

- Create reusable components and feature-based folders. Do not duplicate markup across pages.

- Full Arabic RTL support is mandatory.

- Mobile-first responsive design, with excellent desktop behavior.

- Make it installable-looking as a future PWA, but do not implement actual PWA configuration now.

- Use clean professional Arabic text and realistic Egyptian examples.

- Do not use excessive gradients or overly playful UI.

DESIGN SYSTEM:

- Brand name: "دليل الخدمات"

- Tone: trustworthy, modern, clean, practical, and local to Egypt.

- Primary color: deep navy blue.

- Accent color: warm orange.

- Neutral background, white cards, subtle borders, soft shadows.

- Use an Arabic-friendly font such as Cairo or IBM Plex Sans Arabic.

- Support desktop, tablet, and mobile layouts.

- Use clear loading, empty, error, and no-results states.

ARCHITECTURE:

Organize the project with a feature-based structure similar to Flutter widgets:

src/

  app/

    layouts/

    routes/

  components/

    ui/

    common/

    layout/

    business/

  features/

    home/

    locations/

    services/

    providers/

    requests/

    provider-dashboard/

    admin/

  mocks/

  core/

    types/

    constants/

    utils/

Create reusable components:

- AppShell

- PublicHeader

- Footer

- MobileBottomNavigation

- SearchBarWidget

- EgyptLocationSelector

- GovernorateSelector

- CityAreaSelector

- CategoryCard

- ProviderCard

- ProviderGrid

- RatingWidget

- VerifiedBadge

- ServiceCoverageBadge

- FilterPanel

- StatusBadge

- RequestStepper

- DashboardStatCard

- EmptyState

- LoadingState

- ErrorState

LOCATION MODEL:

The application must treat location as a core feature.

Create mock location data for Egypt using:

- Governorate: القاهرة، الجيزة، الإسكندرية، الدقهلية، الشرقية، الغربية، المنوفية، القليوبية، البحيرة، كفر الشيخ، دمياط، بورسعيد، الإسماعيلية، السويس، شمال سيناء، جنوب سيناء، البحر الأحمر، الفيوم، بني سويف، المنيا، أسيوط، سوهاج، قنا، الأقصر، أسوان، الوادي الجديد، مطروح.

- Include sample cities/areas such as مدينة نصر، التجمع الخامس، المعادي، المهندسين، أكتوبر، الشيخ زايد، سموحة، العجمي، المنصورة، طنطا.

Create these TypeScript models:

- EgyptLocation: governorate, city, area

- Category

- Provider

- ProviderService

- ServiceRequest

- Review

- User

- ServiceCoverage

A provider must have:

- name

- profile image

- category/services

- rating and review count

- verified status

- short description

- starting price or price range

- service areas

- canServeNationwide boolean

- response time

- gallery images

- reviews

SEARCH LOGIC IN THE UI:

The main product flow is:

Service type + Egyptian location + filters = suitable providers.

- Allow user to select governorate, city, and optionally area.

- Include a “استخدم موقعي الحالي” interface option, but keep it UI-only.

- Filter mock provider results by selected service and service coverage.

- Display clear labels such as:

  “يغطي: القاهرة - مدينة نصر”

  “يغطي محافظة الجيزة بالكامل”

  “متاح في جميع محافظات مصر”

- Preserve selected search filters in the URL query string, for example:

  /services?governorate=cairo&city=nasr-city&category=plumbing

PAGES AND ROUTES:

1) Home page: /

- Strong hero section with headline:

  “أفضل الخدمات بالقرب منك، في دقائق”

- Subheadline explaining that users can find verified providers across Egypt.

- Prominent SearchBarWidget:

  service input + governorate selector + city/area selector + search button

- Popular categories section:

  سباكة، كهرباء، تكييف، نقل عفش، تنظيف، دهانات، صيانة أجهزة، نجارة

- Featured verified providers

- “كيف يعمل دليل الخدمات؟” section with 3 steps:

  اختر الخدمة والمكان → قارن مقدمي الخدمة → أرسل طلبك

- Trust section:

  مقدمو خدمة موثقون، تقييمات العملاء، تغطية في جميع أنحاء مصر

- CTA for providers to join the platform.

2) Services search results: /services

- Search summary showing selected service and location.

- Desktop: left/right responsive filter panel.

- Mobile: filter button opens a bottom sheet or drawer.

- Filters:

  category, governorate, city/area, rating, verified only, availability, price range.

- Provider cards in a clean responsive grid.

- Sort controls:

  الأعلى تقييمًا، الأقرب تطابقًا، الأسرع استجابة، الأقل سعرًا.

- Empty state if no providers cover the selected location.

- Allow user to clear filters.

- Use mock filtering logic.

3) Provider details: /provider/:id

- Profile header with image, provider name, verified badge, rating, location coverage, response time, and price range.

- Prominent CTA: “اطلب الخدمة الآن”.

- Mobile sticky CTA at the bottom.

- Tabs or sections:

  نبذة، الخدمات، مناطق التغطية، معرض الأعمال، التقييمات.

- Clearly show whether the provider serves a specific city, full governorate, or all Egypt.

- Related providers section.

4) Request service flow: /request-service

- Multi-step responsive form:

  Step 1: choose service/category

  Step 2: select governorate, city, and area

  Step 3: describe the request and upload optional images

  Step 4: enter customer name and mobile number

  Step 5: confirmation screen

- Show visual progress stepper.

- On submit, simulate success with mock state only.

- Confirmation text:

  “تم إرسال طلبك بنجاح، وسيتم التواصل معك من مقدم الخدمة قريبًا.”

5) Customer requests: /my-requests

- Mock customer request cards.

- Each card displays service, provider, date, location, and status.

- Statuses:

  جديد، قيد التواصل، مكتمل، ملغي.

- Include empty state.

6) Provider dashboard: /provider-dashboard

- Separate dashboard layout with sidebar on desktop and compact navigation on mobile.

- Dashboard summary cards:

  طلبات جديدة، قيد التواصل، طلبات مكتملة، متوسط التقييم.

- Recent leads list/table.

- Lead cards include requested service, customer location, request date, details, and status.

- Provider profile completion prompt.

- Service coverage management UI:

  select governorates and cities, plus a “أغطي جميع محافظات مصر” toggle.

- All interactions are mock UI only.

7) Admin dashboard: /admin

- Admin layout and overview metrics:

  users, providers, new service requests, reviews, active governorates.

- Mock management screens/tables for:

  categories, providers, service requests, reviews, users, Egyptian locations.

- Provider approval status controls in UI only.

NAVIGATION:

Public navigation:

- الرئيسية

- الخدمات

- انضم كمقدم خدمة

- طلباتي

- تسجيل الدخول

Use mock authentication state only to demonstrate:

- Customer view

- Provider dashboard link

- Admin dashboard link

DATA AND FUTURE API READINESS:

- Keep all mock data in separate files.

- Create placeholder API service files for:

  locationsApi, providersApi, servicesApi, requestsApi, authApi.

- Do not connect them to real endpoints yet.

- Add TypeScript types that make future Django REST API integration easy.

- Do not hardcode data inside visual components.

FINAL QUALITY REQUIREMENTS:

- Ensure every page is connected through working client-side navigation.

- Ensure the search and filters work against mock data.

- Ensure all content is Arabic and RTL.

- Use realistic Egyptian names, providers, areas, phone number formats, and prices in EGP.

- Make the app look like a real production-ready product demo prepared for future Django REST API integration.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7d9b240d-11cb-4030-8e3a-2fcf86164b57).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
