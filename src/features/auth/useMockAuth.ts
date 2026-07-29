import { useSyncExternalStore } from "react";
import type { User, UserRole } from "@/core/types";
import { mockUsers } from "@/mocks/requests";

/** UI-only mock auth store. No real authentication logic. */
let currentUser: User | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export const mockAuth = {
  signInAs(role: Exclude<UserRole, "guest">) {
    currentUser = mockUsers[role];
    emit();
  },
  signOut() {
    currentUser = null;
    emit();
  },
};

export function useMockAuth() {
  const user = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => currentUser,
    () => null,
  );

  return {
    user,
    role: (user?.role ?? "guest") as UserRole,
    isAuthenticated: Boolean(user),
    signInAs: mockAuth.signInAs,
    signOut: mockAuth.signOut,
  };
}
