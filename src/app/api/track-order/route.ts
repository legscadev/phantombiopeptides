import { NextResponse } from "next/server";
import { wc } from "@/services/woocommerce";
import type { WCAddress } from "@/types";

interface WCOrder {
  id: number;
  status: string;
  date_created: string;
  total: string;
  billing?: WCAddress;
  meta_data?: Array<{ key: string; value: string }>;
}

/**
 * Public order lookup: verifies the visitor knows both the order number
 * and the billing email before revealing anything else.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const orderId = url.searchParams.get("order");
  const email = url.searchParams.get("email")?.toLowerCase().trim();
  if (!orderId || !email) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  try {
    const order = await wc<WCOrder>(`/orders/${orderId}`, { revalidate: 0 });
    if ((order.billing?.email ?? "").toLowerCase() !== email) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const trackingMeta = order.meta_data?.find((m) =>
      /tracking/i.test(m.key),
    );
    const trackingUrl = order.meta_data?.find((m) =>
      /tracking.*url|track.*url/i.test(m.key),
    )?.value;

    return NextResponse.json({
      status: order.status,
      date_created: order.date_created,
      total: order.total,
      tracking_number: trackingMeta?.value,
      tracking_url: trackingUrl,
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
