import { GhostSession, pickFingerprintProfile } from "../index.js";

const targetUrl = process.env.GHOST_TARGET_URL ?? "https://example.com";

const session = new GhostSession({
  fingerprintProfile: pickFingerprintProfile(),
  policy: {
    allowList: [new URL(targetUrl).hostname],
    maxRequestsPerMinute: 10,
    maxConcurrentSessions: 1,
    respectRobotsTxt: true
  }
});

const context = await session.launch();

try {
  await session.withPage(async (page) => {
    await session.throttle();
    await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
    await session.humanPause();
    const title = await page.title();
    console.log(`Visited ${targetUrl}`);
    console.log(`Title: ${title}`);
  });
} finally {
  await context.close();
  await session.close();
}
