import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Sample the real computed palette off phantombiopeptides.com by launching
 * Chromium with realistic fingerprint flags so Cloudflare doesn't 403 us.
 */

const OUT = path.resolve(".audit");
const ORIGIN = "https://phantombiopeptides.com";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.6478.127 Safari/537.36";

async function main() {
  await fs.mkdir(path.join(OUT, "screenshots"), { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: [
      "--disable-blink-features=AutomationControlled",
      "--disable-features=IsolateOrigins,site-per-process",
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: UA,
    locale: "en-US",
    timezoneId: "America/New_York",
    javaScriptEnabled: true,
    deviceScaleFactor: 2,
    extraHTTPHeaders: {
      "Accept-Language": "en-US,en;q=0.9",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    },
  });

  // Hide the automation flag before any page script runs
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => undefined });
    // Common stealth touches
    Object.defineProperty(navigator, "languages", {
      get: () => ["en-US", "en"],
    });
    Object.defineProperty(navigator, "plugins", {
      get: () => [1, 2, 3, 4, 5],
    });
    // eslint-disable-next-line no-undef
    window.chrome = { runtime: {} };
  });

  const page = await context.newPage();

  // Try up to 3 times, waiting for the Cloudflare challenge to clear.
  for (let attempt = 1; attempt <= 3; attempt++) {
    process.stderr.write(`attempt ${attempt}...\n`);
    await page.goto(ORIGIN, { waitUntil: "domcontentloaded", timeout: 45_000 });
    await page.waitForTimeout(6500);
    const title = await page.title();
    const looksBlocked = /just a moment|checking your browser|attention required/i.test(
      title,
    );
    if (!looksBlocked) break;
    if (attempt < 3) await page.waitForTimeout(3000);
  }

  // Wait for the SPA to actually render — poll until an h1 or main content
  // is visible, or 20s max.
  await page
    .waitForFunction(
      () =>
        document.querySelector("h1, h2, main [class*='hero'], [class*='product']") !==
        null,
      null,
      { timeout: 20_000 },
    )
    .catch(() => process.stderr.write("content selector never appeared\n"));

  // Scroll to trigger any lazy content
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 200));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1500);

  const data = await page.evaluate(() => {
    function rgbToHex(rgb) {
      const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!m) return rgb;
      const [r, g, b] = [m[1], m[2], m[3]].map((n) => Number(n));
      return (
        "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")
      );
    }
    function hasColor(c) {
      return c && c !== "rgba(0, 0, 0, 0)" && !c.startsWith("rgba(0");
    }
    const body = getComputedStyle(document.body);
    const h1 = document.querySelector("h1");
    const h1Style = h1 ? getComputedStyle(h1) : null;

    const buttons = Array.from(
      document.querySelectorAll("main a, main button, header a, header button"),
    )
      .map((el) => {
        const s = getComputedStyle(el);
        return {
          text: (el.textContent || "").trim().slice(0, 40),
          bg: rgbToHex(s.backgroundColor),
          color: rgbToHex(s.color),
          radius: s.borderRadius,
          font: s.fontFamily,
          border: s.border,
          rawBg: s.backgroundColor,
          rawColor: s.color,
        };
      })
      .filter((b) => hasColor(b.rawBg) && b.text.length > 0)
      .slice(0, 12);

    // Frequency-weighted palette
    const freq = new Map();
    const els = document.querySelectorAll(
      "body, header, footer, main, main *:not(script):not(style)",
    );
    let count = 0;
    for (const el of els) {
      if (count++ > 800) break;
      const s = getComputedStyle(el);
      for (const c of [s.color, s.backgroundColor, s.borderColor]) {
        if (!hasColor(c)) continue;
        const hex = rgbToHex(c);
        freq.set(hex, (freq.get(hex) || 0) + 1);
      }
    }
    const palette = [...freq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([hex, count]) => ({ hex, count }));

    // Font families in use
    const fontFreq = new Map();
    for (const el of els) {
      const f = getComputedStyle(el).fontFamily;
      fontFreq.set(f, (fontFreq.get(f) || 0) + 1);
    }
    const fonts = [...fontFreq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return {
      title: document.title,
      url: location.href,
      body: {
        bg: rgbToHex(body.backgroundColor),
        color: rgbToHex(body.color),
        font: body.fontFamily,
        fontSize: body.fontSize,
      },
      h1: h1Style
        ? {
            text: (h1?.textContent || "").trim().slice(0, 160),
            font: h1Style.fontFamily,
            size: h1Style.fontSize,
            weight: h1Style.fontWeight,
            color: rgbToHex(h1Style.color),
          }
        : null,
      palette,
      fonts,
      buttons,
      docHeight: document.documentElement.scrollHeight,
    };
  });

  await page.screenshot({
    path: path.join(OUT, "screenshots", "phantom-live-desktop.png"),
    fullPage: true,
  });
  await fs.writeFile(
    path.join(OUT, "phantom-palette.json"),
    JSON.stringify(data, null, 2),
  );

  console.log(JSON.stringify(data, null, 2));
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
