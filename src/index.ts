import { chromium } from "playwright";

const targetUrl = process.env.GHOST_TARGET_URL ?? "https://example.com";

const run = async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
  const title = await page.title();

  console.log(`Visited ${targetUrl}`);
  console.log(`Title: ${title}`);

  await browser.close();
};

run().catch((error) => {
  console.error("GhostProtocol demo failed:", error);
  process.exitCode = 1;
});
