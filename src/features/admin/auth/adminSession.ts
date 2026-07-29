/**
 * Admin session store (frontend architecture only).
 *
 * No real authentication happens here. When the ASP.NET Core Identity backend
 * lands, `signIn` keeps its signature and starts returning a JWT + refresh
 * token pair; components and guards stay untouched.
 */
import { useCallback, useSyncExternalStore } from "react";
import { adminRepository } from "@/core/repositories/adminRepository";
import { checkPermission } from "@/core/constants/permissions";
import type { AdminUserDTO, PermissionKey } from "@/core/types/admin";

const STORAGE_KEY = "ayez-admin-session";

let current: AdminUserDTO | null = null;
let restored = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export const adminSession = {
  get: () => current,

  async signIn(email: string, password: string) {
    current = await adminRepository.login(email, password);
    restored = true;
    try {
      window.localStorage.setItem(STORAGE_KEY, current.id);
    } catch {
      /* storage unavailable — session stays in memory */
    }
    emit();
    return current;
  },

  signOut() {
    current = null;
    restored = true;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    emit();
  },

  /** Rehydrates the previous session once per page load (client-side only). */
  async restore() {
    if (restored) return current;
    restored = true;
    let id: string | null = null;
    try {
      id = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      id = null;
    }
    if (!id) {
      emit();
      return null;
    }
    current = (await adminRepository.me(id)) ?? null;
    emit();
    return current;
  },

  isRestored: () => restored,
};

/** Reads the admin session and exposes permission-based authorization helpers. */
export function useAdminSession() {
  const admin = useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );

  const permissions = (admin?.permissions ?? []) as PermissionKey[];

  const can = useCallback(
    (required?: PermissionKey | PermissionKey[]) => checkPermission(permissions, required),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [admin?.id, permissions.length],
  );

  return {
    admin,
    permissions,
    isAuthenticated: Boolean(admin) && admin?.status !== "suspended",
    can,
    signIn: adminSession.signIn,
    signOut: adminSession.signOut,
  };
}
