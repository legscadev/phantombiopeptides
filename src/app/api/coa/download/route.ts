/**
 * Proxy a COA PDF through our own origin so the browser honours the
 * `download` attribute. Cross-origin `<a download>` links are ignored
 * by every modern browser for security reasons; fetching the file
 * server-side and re-emitting it with `Content-Disposition: attachment`
 * bypasses that restriction cleanly.
 *
 * Allowlist prevents this endpoint from being abused as an open proxy —
 * only URLs from hosts we actually serve PDFs from are permitted.
 */

const ALLOWED_HOSTS = new Set<string>([
  "kickbackai-pkjdo.wpcomstaging.com",
  "admin.phantombiopeptides.com",
  "phantombiopeptides.com",
  "www.phantombiopeptides.com",
  "i0.wp.com",
  "i1.wp.com",
  "i2.wp.com",
]);

function sanitizeFilename(name: string): string {
  // Strip control chars, path separators, and quotes. Cap length so
  // Content-Disposition stays readable.
  const cleaned = name
    .replace(/[\x00-\x1f\x7f]/g, "")
    .replace(/[\/\\?%*:|"<>]/g, "-")
    .trim();
  return (cleaned || "coa.pdf").slice(0, 120);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("url");
  const name = searchParams.get("name") || "coa.pdf";

  if (!target) {
    return new Response("Missing url", { status: 400 });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(target);
  } catch {
    return new Response("Invalid url", { status: 400 });
  }

  if (
    (targetUrl.protocol !== "https:" && targetUrl.protocol !== "http:") ||
    !ALLOWED_HOSTS.has(targetUrl.hostname)
  ) {
    return new Response("Host not allowed", { status: 403 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(targetUrl.toString(), {
      headers: {
        "User-Agent":
          "PhantomBiopeptides-Nextjs/1.0 (+https://phantombiopeptides.com)",
      },
      next: { revalidate: 3600 },
    });
  } catch {
    return new Response("Upstream fetch failed", { status: 502 });
  }

  if (!upstream.ok) {
    return new Response(`Upstream ${upstream.status}`, {
      status: upstream.status,
    });
  }

  const buf = await upstream.arrayBuffer();
  const contentType =
    upstream.headers.get("content-type") || "application/pdf";
  const filename = sanitizeFilename(name);

  return new Response(buf, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control":
        "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
