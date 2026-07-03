import { NextResponse } from "next/server";
import { SearchService } from "@/services/search";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? "";
  const limit = Number(url.searchParams.get("limit") ?? "6");
  const { products } = await SearchService.query(q, limit);
  return NextResponse.json({ products }, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
