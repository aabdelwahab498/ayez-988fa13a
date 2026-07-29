/**
 * Identity domain contract — users, customers, providers, admins, roles.
 * Auth is JWT bearer + refresh token; identical for web and mobile.
 */
import type { IsoDateTime, ListQueryContract, Uuid } from "./envelope";

export type UserRoleContract = "customer" | "provider" | "provider_staff" | "admin" | "support";

export type UserStatusContract = "pending" | "active" | "suspended" | "deleted";

/** Fine-grained permission string, e.g. `leads.assign`, `providers.approve`. */
export type PermissionContract = string;

export interface UserDtoContract {
  id: Uuid;
  fullName: string;
  email: string | null;
  phone: string;
  phoneVerified: boolean;
  emailVerified: boolean;
  avatarUrl: string | null;
  locale: "ar" | "en";
  role: UserRoleContract;
  status: UserStatusContract;
  /** Present when `role === "provider"`. */
  providerId: Uuid | null;
  permissions: PermissionContract[];
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface RoleDtoContract {
  key: UserRoleContract;
  name: string;
  description: string;
  permissions: PermissionContract[];
}

/* -------------------------------------------------------------- requests */

export interface RegisterRequestContract {
  fullName: string;
  phone: string;
  email?: string;
  password: string;
  locale?: "ar" | "en";
  /** `customer` by default; `provider` starts the onboarding funnel. */
  intendedRole?: Extract<UserRoleContract, "customer" | "provider">;
}

export interface LoginRequestContract {
  /** Phone (E.164, `+20…`) or email. */
  identifier: string;
  password: string;
  /** Optional device binding for push notifications. */
  device?: DeviceRegistrationContract;
}

export interface OtpRequestContract {
  phone: string;
  purpose: "login" | "verify_phone" | "reset_password";
}

export interface OtpVerifyContract {
  phone: string;
  code: string;
  purpose: OtpRequestContract["purpose"];
}

export interface RefreshRequestContract {
  refreshToken: string;
}

export interface UpdateProfileRequestContract {
  fullName?: string;
  email?: string;
  avatarAssetId?: Uuid;
  locale?: "ar" | "en";
}

export interface ChangePasswordRequestContract {
  currentPassword: string;
  newPassword: string;
}

export interface AssignRoleRequestContract {
  role: UserRoleContract;
  permissions?: PermissionContract[];
}

/* ------------------------------------------------------------- responses */

export interface AuthTokensContract {
  accessToken: string;
  /** Seconds until `accessToken` expires. */
  expiresIn: number;
  refreshToken: string;
  refreshExpiresIn: number;
  tokenType: "Bearer";
}

export interface AuthSessionDtoContract {
  tokens: AuthTokensContract;
  user: UserDtoContract;
}

export interface DeviceRegistrationContract {
  platform: "web" | "android" | "ios";
  pushToken: string;
  deviceId: string;
  appVersion: string;
  osVersion?: string;
}

export interface UserListQueryContract extends ListQueryContract {
  role?: UserRoleContract;
  status?: UserStatusContract;
  createdFrom?: IsoDateTime;
  createdTo?: IsoDateTime;
}
