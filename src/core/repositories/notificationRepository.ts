/** NotificationRepository — in-app notification centre. */
import { notificationsApi } from "@/core/api/notificationsApi";
import type { NotificationDTO } from "@/core/types/dto";

export interface NotificationRepository {
  list(): Promise<NotificationDTO[]>;
  markRead(id: string): Promise<{ id: string }>;
}

class MockNotificationRepository implements NotificationRepository {
  list() {
    return notificationsApi.list();
  }
  markRead(id: string) {
    return notificationsApi.markRead(id);
  }
}

export const notificationRepository: NotificationRepository = new MockNotificationRepository();
