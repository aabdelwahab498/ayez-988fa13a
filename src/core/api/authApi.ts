import { mockRequest } from "./client";
import { mockUsers } from "@/mocks/requests";
import type { User, UserRole } from "@/core/types";

export const authApi = {
  /** POST /api/v1/auth/login/ */
  login: (role: Exclude<UserRole, "guest">): Promise<User> =>
    mockRequest(mockUsers[role]),

  /** POST /api/v1/auth/logout/ */
  logout: () => mockRequest(true),

  /** GET /api/v1/auth/me/ */
  me: (): Promise<User | null> => mockRequest(null),
};
