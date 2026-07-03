"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AuthService } from "@/services/auth";
import type { WCCustomer } from "@/services/auth";

export interface AuthResult {
  ok: boolean;
  error?: string;
}

export async function loginAction(input: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  try {
    await AuthService.login(input.email, input.password);
    revalidatePath("/account");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Login failed.",
    };
  }
}

export async function registerAction(input: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}): Promise<AuthResult> {
  try {
    await AuthService.register(input);
    await AuthService.login(input.email, input.password);
    revalidatePath("/account");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Registration failed.",
    };
  }
}

export async function logoutAction(): Promise<void> {
  await AuthService.logout();
  revalidatePath("/");
  redirect("/");
}

export async function updateCustomerAction(
  updates: Partial<{
    first_name: string;
    last_name: string;
    billing: WCCustomer["billing"];
    shipping: WCCustomer["shipping"];
  }>,
): Promise<AuthResult> {
  try {
    await AuthService.updateCustomer(updates);
    revalidatePath("/account");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Update failed.",
    };
  }
}
