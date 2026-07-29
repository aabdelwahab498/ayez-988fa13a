/** Notifications — in-app, push (FCM/APNs), email and WhatsApp. */
import type { IsoDateTime, ListQueryContract, Uuid } from "./envelope";

export type NotificationChannelContract = "in_app" | "push" | "email" | "whatsapp" | "sms";

export type NotificationKindContract =
  | "lead_new"
  | "lead_expiring"
  | "request_status"
  | "review_new"
  | "billing_invoice"
  | "billing_past_due"
  | "verification"
  | "campaign"
  | "system";

export interface NotificationDtoContract {
  id: Uuid;
  kind: NotificationKindContract;
  title: string;
  body: string;
  read: boolean;
  /** Deep link shared by web and Flutter, e.g. `/provider-dashboard?tab=leads`. */
  actionPath: string | null;
  imageUrl: string | null;
  /** Entity ids so clients can refresh precise caches. */
  data: Record<string, string>;
  createdAt: IsoDateTime;
  readAt: IsoDateTime | null;
}

export interface NotificationListQueryContract extends ListQueryContract {
  kind?: NotificationKindContract;
  unreadOnly?: boolean;
}

export interface UnreadCountContract {
  total: number;
  byKind: Partial<Record<NotificationKindContract, number>>;
}

export interface NotificationPreferencesContract {
  /** Per kind, which channels are enabled. */
  matrix: Record<NotificationKindContract, NotificationChannelContract[]>;
  quietHours: { enabled: boolean; startHour: number; endHour: number } | null;
  locale: "ar" | "en";
}

export interface RegisterPushDeviceContract {
  platform: "web" | "android" | "ios";
  /** FCM token for web/Android, APNs token for iOS. */
  pushToken: string;
  deviceId: string;
  appVersion: string;
  locale?: "ar" | "en";
}

/** Server-owned message templates; clients never hardcode copy. */
export interface NotificationTemplateContract {
  key: string;
  kind: NotificationKindContract;
  channels: NotificationChannelContract[];
  variables: string[];
  /** WhatsApp Business template name when `channels` includes `whatsapp`. */
  whatsappTemplateName?: string;
}
