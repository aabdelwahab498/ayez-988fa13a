import { useSyncExternalStore } from "react";
import type { User, UserRole } from "@/core/types";
import { customerRepository } from "@/core/repositories";

/** UI-only mock auth store. No real authentication logic. */
let currentUser: User | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export const mockAuth = {
  /** Session identity comes from the repository layer, never from mocks. */
  async signInAs(role: Exclude<UserRole, "guest">) {
    currentUser = await customerRepository.signInAs(role);
    emit();
  },
  async signOut() {
    await customerRepository.signOut();
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
