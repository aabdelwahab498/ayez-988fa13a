/** Placeholder API service — `/api/v1/notifications/`. */
import { ENDPOINTS, mockRequest } from "./http";
import { notifications } from "@/mocks/notifications";
import { mapNotification } from "./mappers";
import type { NotificationDTO } from "@/core/types/dto";

export const notificationsApi = {
  /** GET /api/v1/notifications/ */
  list: (): Promise<NotificationDTO[]> => {
    void ENDPOINTS.notifications.list;
    return mockRequest(notifications.map(mapNotification));
  },

  /** POST /api/v1/notifications/{id}/read/ */
  markRead: (id: string): Promise<{ id: string }> => mockRequest({ id }, 200),
};
