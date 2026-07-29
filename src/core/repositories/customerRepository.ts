/** CustomerRepository — customer profile / session identity (no auth logic). */
import { authApi } from "@/core/api/authApi";
import type { User, UserRole } from "@/core/types";

export interface CustomerRepository {
  me(): Promise<User | null>;
  signInAs(role: Exclude<UserRole, "guest">): Promise<User>;
  signOut(): Promise<boolean>;
}

class MockCustomerRepository implements CustomerRepository {
  me() {
    return authApi.me();
  }
  signInAs(role: Exclude<UserRole, "guest">) {
    return authApi.login(role);
  }
  signOut() {
    return authApi.logout();
  }
}

export const customerRepository: CustomerRepository = new MockCustomerRepository();
