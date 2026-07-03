import "server-only";
import { cookies } from "next/headers";
import { z } from "zod";
import { env } from "@/env";
import { wc } from "./woocommerce";

/**
 * Auth layer against the "JWT Authentication for WP REST API" plugin.
 *
 * WordPress endpoints:
 *   POST /wp-json/jwt-auth/v1/token          { username, password } → { token, user_email, ... }
 *   POST /wp-json/jwt-auth/v1/token/validate (with Authorization: Bearer <token>)
 *
 * We store the JWT in an httpOnly cookie so the browser never sees it.
 * Customer profile + orders come from the WooCommerce REST v3 endpoints,
 * authenticated via the shop's consumer key/secret (server-side).
 */

const SESSION_COOKIE = "pl_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 14;

const tokenResponseSchema = z.object({
  token: z.string(),
  user_email: z.string(),
  user_nicename: z.string().optional().default(""),
  user_display_name: z.string().optional().default(""),
});

const customerSchema = z.object({
  id: z.number(),
  date_created: z.string(),
  email: z.string(),
  first_name: z.string().default(""),
  last_name: z.string().default(""),
  username: z.string().default(""),
  billing: z
    .object({
      first_name: z.string().default(""),
      last_name: z.string().default(""),
      company: z.string().default(""),
      address_1: z.string().default(""),
      address_2: z.string().default(""),
      city: z.string().default(""),
      state: z.string().default(""),
      postcode: z.string().default(""),
      country: z.string().default(""),
      email: z.string().default(""),
      phone: z.string().default(""),
    })
    .optional(),
  shipping: z
    .object({
      first_name: z.string().default(""),
      last_name: z.string().default(""),
      company: z.string().default(""),
      address_1: z.string().default(""),
      address_2: z.string().default(""),
      city: z.string().default(""),
      state: z.string().default(""),
      postcode: z.string().default(""),
      country: z.string().default(""),
    })
    .optional(),
});

const orderSchema = z.object({
  id: z.number(),
  number: z.string(),
  status: z.string(),
  date_created: z.string(),
  total: z.string(),
  currency: z.string().default("USD"),
  line_items: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        quantity: z.number(),
        total: z.string(),
      }),
    )
    .default([]),
  billing: z
    .object({ email: z.string().optional().default("") })
    .optional(),
  shipping_lines: z
    .array(z.object({ method_title: z.string(), total: z.string() }))
    .optional(),
});

export type WCCustomer = z.infer<typeof customerSchema>;
export type WCOrder = z.infer<typeof orderSchema>;

interface Session {
  token: string;
  email: string;
  displayName: string;
  customerId?: number;
}

function serializeSession(s: Session): string {
  return Buffer.from(JSON.stringify(s), "utf8").toString("base64url");
}
function deserializeSession(raw: string): Session | null {
  try {
    return JSON.parse(
      Buffer.from(raw, "base64url").toString("utf8"),
    ) as Session;
  } catch {
    return null;
  }
}

export const AuthService = {
  async getSession(): Promise<Session | null> {
    const store = await cookies();
    const raw = store.get(SESSION_COOKIE)?.value;
    if (!raw) return null;
    return deserializeSession(raw);
  },

  async login(
    username: string,
    password: string,
  ): Promise<{ session: Session }> {
    if (!env.WC_STORE_URL) {
      throw new Error("WC_STORE_URL not configured.");
    }
    const res = await fetch(
      `${env.WC_STORE_URL.replace(/\/$/, "")}/wp-json/jwt-auth/v1/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ username, password }),
        cache: "no-store",
      },
    );

    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      /* empty */
    }

    if (!res.ok) {
      const msg =
        (body as { message?: string } | null)?.message ??
        "Login failed. Check your credentials.";
      throw new Error(msg);
    }

    const parsed = tokenResponseSchema.parse(body);

    // Look up the customer id so orders/addresses become one-shot fetches.
    let customerId: number | undefined;
    try {
      const list = await wc<WCCustomer[]>("/customers", {
        query: { email: parsed.user_email, per_page: 1 },
        revalidate: 0,
      });
      customerId = list[0]?.id;
    } catch {
      /* customer lookup optional */
    }

    const session: Session = {
      token: parsed.token,
      email: parsed.user_email,
      displayName: parsed.user_display_name || parsed.user_nicename,
      customerId,
    };

    const store = await cookies();
    store.set(SESSION_COOKIE, serializeSession(session), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });

    return { session };
  },

  async register(input: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }): Promise<void> {
    // Creates the WP user via the WooCommerce Customers REST endpoint.
    // Requires consumer key/secret configured.
    await wc<WCCustomer>("/customers", {
      method: "POST",
      body: {
        email: input.email,
        password: input.password,
        first_name: input.first_name,
        last_name: input.last_name,
        username: input.email,
      },
      revalidate: 0,
    });
  },

  async logout(): Promise<void> {
    const store = await cookies();
    store.delete(SESSION_COOKIE);
  },

  async getCustomer(): Promise<WCCustomer | null> {
    const session = await this.getSession();
    if (!session?.customerId) return null;
    try {
      const data = await wc<WCCustomer>(`/customers/${session.customerId}`, {
        revalidate: 0,
      });
      return customerSchema.parse(data);
    } catch {
      return null;
    }
  },

  async updateCustomer(
    updates: Partial<{
      first_name: string;
      last_name: string;
      billing: WCCustomer["billing"];
      shipping: WCCustomer["shipping"];
    }>,
  ): Promise<WCCustomer | null> {
    const session = await this.getSession();
    if (!session?.customerId) return null;
    const data = await wc<WCCustomer>(`/customers/${session.customerId}`, {
      method: "PUT",
      body: updates,
      revalidate: 0,
    });
    return customerSchema.parse(data);
  },

  async listOrders(): Promise<WCOrder[]> {
    const session = await this.getSession();
    if (!session?.customerId) return [];
    try {
      const data = await wc<WCOrder[]>("/orders", {
        query: { customer: session.customerId, per_page: 50, orderby: "date", order: "desc" },
        revalidate: 0,
      });
      return z.array(orderSchema).parse(data);
    } catch {
      return [];
    }
  },

  async getOrder(id: number): Promise<WCOrder | null> {
    const session = await this.getSession();
    if (!session?.customerId) return null;
    try {
      const data = await wc<WCOrder>(`/orders/${id}`, { revalidate: 0 });
      const parsed = orderSchema.parse(data);
      // Ensure the order belongs to this customer.
      if (parsed.billing?.email !== session.email) return null;
      return parsed;
    } catch {
      return null;
    }
  },
};
