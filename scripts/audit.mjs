import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Regular-browsing smoke test across both sites.
 * Emits screenshots + a JSON report + a Markdown summary to .audit/.
 */

const OUT = path.resolve(".audit");
const SHOTS = path.join(OUT, "screenshots");

const SITES = [
  {
    key: "evo",
    label: "EVO Labs Research",
    origin: "https://www.evolabsresearch.co",
    routes: [
      { key: "home", path: "/" },
      { key: "shop", path: "/shop" },
      { key: "pdp", path: "/products/bpc-157" },
      { key: "coa", path: "/coa" },
    ],
  },
  {
    key: "phantom",
    label: "Phantom Bio Peptides",
    origin: "https://phantombiopeptides.com",
    routes: [
      { key: "home", path: "/" },
      { key: "shop", path: "/shop" },
      { key: "pdp", path: "/product/kpv-2" },
    ],
  },
];

const VIEWPORTS = [
  { key: "mobile", width: 390, height: 844 },
  { key: "desktop", width: 1440, height: 900 },
];

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

async function extract(page) {
  return page.evaluate(() => {
    function rgbToHex(rgb) {
      const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!m) return rgb;
      const [r, g, b] = [m[1], m[2], m[3]].map((n) => Number(n));
      return "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("");
    }
    const body = document.body;
    const bodyStyle = getComputedStyle(body);
    const h1 = document.querySelector("h1");
    const h1Style = h1 ? getComputedStyle(h1) : null;

    // Try to find the primary CTA — first visible <a> or <button> in header or main
    const btnCandidates = Array.from(
      document.querySelectorAll("main a, main button, header a, header button"),
    ).filter((el) => {
      const style = getComputedStyle(el);
      const bg = style.backgroundColor;
      return (
        bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent" && el.offsetWidth > 40
      );
    });
    const btn = btnCandidates[0];
    const btnStyle = btn ? getComputedStyle(btn) : null;

    // Colors that appear on the page — sample a handful
    const palette = new Set();
    const sampleEls = document.querySelectorAll(
      "body, header, main, h1, h2, h3, a, button, .btn, [class*='primary'], [class*='card']",
    );
    let count = 0;
    for (const el of sampleEls) {
      if (count++ > 60) break;
      const s = getComputedStyle(el);
      [s.color, s.backgroundColor, s.borderColor].forEach((c) => {
        if (c && c !== "rgba(0, 0, 0, 0)" && !c.startsWith("rgba(0")) {
          palette.add(rgbToHex(c));
        }
      });
    }

    // Section-level structure — count sections and grab their tags/classes
    const sections = Array.from(document.querySelectorAll("section, main > div"))
      .slice(0, 20)
      .map((el) => ({
        tag: el.tagName.toLowerCase(),
        cls: (el.className || "").toString().slice(0, 80),
        h: el.getBoundingClientRect().height | 0,
      }));

    return {
      title: document.title,
      url: location.href,
      viewport: { w: window.innerWidth, h: window.innerHeight },
      body: {
        bg: rgbToHex(bodyStyle.backgroundColor),
        color: rgbToHex(bodyStyle.color),
        font: bodyStyle.fontFamily,
        fontSize: bodyStyle.fontSize,
      },
      h1: h1Style
        ? {
            text: (h1?.textContent || "").trim().slice(0, 140),
            font: h1Style.fontFamily,
            size: h1Style.fontSize,
            weight: h1Style.fontWeight,
            color: rgbToHex(h1Style.color),
          }
        : null,
      primaryButton: btnStyle
        ? {
            text: (btn?.textContent || "").trim().slice(0, 40),
            bg: rgbToHex(btnStyle.backgroundColor),
            color: rgbToHex(btnStyle.color),
            radius: btnStyle.borderRadius,
            padding: btnStyle.padding,
          }
        : null,
      palette: Array.from(palette).slice(0, 24),
      sectionCount: document.querySelectorAll("section").length,
      sections,
      linkCount: document.querySelectorAll("a").length,
      hasStripe: /js\.stripe\.com/i.test(document.documentElement.outerHTML),
      docHeight: document.documentElement.scrollHeight,
    };
  });
}

async function auditRoute(browser, site, route, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    userAgent: UA,
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();
  const errors = [];
  const status = { httpErrors: [] };
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("response", (r) => {
    if (r.status() >= 400 && r.url().startsWith(site.origin)) {
      status.httpErrors.push({ url: r.url(), status: r.status() });
    }
  });

  const target = site.origin + route.path;
  const t0 = Date.now();
  let response = null;
  try {
    response = await page.goto(target, {
      waitUntil: "networkidle",
      timeout: 30_000,
    });
  } catch (e) {
    errors.push("goto: " + (e instanceof Error ? e.message : String(e)));
  }
  const loadMs = Date.now() - t0;

  // Dismiss any obvious 21+ / cookie overlay so screenshots aren't blocked
  try {
    await page
      .locator(
        'button:has-text("I am"), button:has-text("Yes"), button:has-text("Enter"), button:has-text("21"), button:has-text("Accept")',
      )
      .first()
      .click({ timeout: 1200 });
  } catch {
    /* no gate */
  }
  await page.waitForTimeout(500);

  let data = null;
  try {
    data = await extract(page);
  } catch (e) {
    errors.push("extract: " + (e instanceof Error ? e.message : String(e)));
  }

  const shot = path.join(
    SHOTS,
    `${site.key}-${route.key}-${viewport.key}.png`,
  );
  try {
    await page.screenshot({ path: shot, fullPage: true });
  } catch (e) {
    errors.push("shot: " + (e instanceof Error ? e.message : String(e)));
  }

  await context.close();
  return {
    site: site.key,
    route: route.key,
    viewport: viewport.key,
    target,
    status: response?.status(),
    loadMs,
    screenshot: path.relative(OUT, shot),
    errors,
    httpErrors: status.httpErrors.slice(0, 5),
    data,
  };
}

async function main() {
  await fs.mkdir(SHOTS, { recursive: true });
  const browser = await chromium.launch();
  const results = [];
  for (const site of SITES) {
    for (const route of site.routes) {
      for (const viewport of VIEWPORTS) {
        process.stderr.write(
          `→ ${site.key}${route.path} @ ${viewport.key}\n`,
        );
        const r = await auditRoute(browser, site, route, viewport);
        results.push(r);
      }
    }
  }
  await browser.close();

  await fs.writeFile(
    path.join(OUT, "report.json"),
    JSON.stringify(results, null, 2),
  );

  // Markdown summary
  const lines = ["# Audit report", ""];
  for (const site of SITES) {
    lines.push(`## ${site.label} (${site.origin})`, "");
    const desktop = results.filter(
      (r) => r.site === site.key && r.viewport === "desktop",
    );
    for (const r of desktop) {
      lines.push(`### ${r.route} — \`${r.target}\``);
      lines.push(`- Status: **${r.status ?? "no-response"}** · Load: ${r.loadMs} ms · Sections: ${r.data?.sectionCount ?? "?"} · Doc height: ${r.data?.docHeight ?? "?"}px`);
      if (r.data?.h1)
        lines.push(`- H1: "${r.data.h1.text}" · ${r.data.h1.font.split(",")[0]} · ${r.data.h1.size} / ${r.data.h1.weight} · ${r.data.h1.color}`);
      if (r.data?.body)
        lines.push(`- Body: bg ${r.data.body.bg}, text ${r.data.body.color}, font ${r.data.body.font.split(",")[0]}`);
      if (r.data?.primaryButton)
        lines.push(`- Primary btn: "${r.data.primaryButton.text}" · bg ${r.data.primaryButton.bg}, color ${r.data.primaryButton.color}, radius ${r.data.primaryButton.radius}`);
      if (r.data?.palette)
        lines.push(`- Palette (sample): ${r.data.palette.slice(0, 12).join(" ")}`);
      if (r.errors.length)
        lines.push(`- ⚠ Errors: ${r.errors.length} — first: ${r.errors[0].slice(0, 160)}`);
      lines.push("");
    }
  }
  await fs.writeFile(path.join(OUT, "report.md"), lines.join("\n"));

  console.log(JSON.stringify({ pages: results.length, out: OUT }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
