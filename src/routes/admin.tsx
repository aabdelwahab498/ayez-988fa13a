import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/features/admin/components/AdminLayout";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "مركز التحكم | عايز" },
      { name: "description", content: "لوحة تحكم منصة عايز: المستخدمون، المزودون، الطلبات، الاشتراكات والإعدادات." },
      { property: "og:title", content: "مركز تحكم عايز" },
      { property: "og:description", content: "إدارة كاملة لمنصة عايز عبر جميع محافظات مصر." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});
