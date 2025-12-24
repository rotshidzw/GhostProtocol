# GhostProtocol

A stealth-optimized browser automation framework with safety and compliance controls.

## What this provides
- **Session orchestration** with reusable browser contexts.
- **Fingerprint profiles** to keep session attributes consistent.
- **Behavior pacing** to avoid unrealistic request bursts.
- **Proxy rotation hooks** (bring your own provider).
- **Policy guardrails** for allowlists, blocklists, and rate limits.

> GhostProtocol is intended for permitted automation and data collection. Always follow site terms of service and applicable laws.

## Quick start
```bash
npm install
npm run build
```

```ts
import { GhostSession, ProxyPool, pickFingerprintProfile } from "./dist/index.js";

const proxies = new ProxyPool([
  { server: "http://proxy.example:8000", username: "user", password: "pass" }
]);

const session = new GhostSession({
  fingerprintProfile: pickFingerprintProfile(),
  proxy: proxies.next(),
  policy: {
    allowList: ["example.com"],
    maxRequestsPerMinute: 20,
    maxConcurrentSessions: 2,
    respectRobotsTxt: true
  }
});

const context = await session.launch();

await session.withPage(async (page) => {
  await session.throttle();
  await page.goto("https://example.com", { waitUntil: "domcontentloaded" });
  await session.humanPause();
});

await context.close();
await session.close();
```

## Run the demo
```bash
npm install
npm run build
npm start
```

Override the target URL:
```bash
GHOST_TARGET_URL="https://example.com" npm start
```

## Project structure
- `src/core/ghostSession.ts`: session lifecycle, throttling, and policy checks.
- `src/core/fingerprintProfile.ts`: consistent browser identity templates.
- `src/core/behavior.ts`: pacing utilities for interaction timing.
- `src/core/proxyPool.ts`: proxy rotation helper.
- `src/core/sessionPolicy.ts`: allowlist/blocklist + compliance guardrails.
- `src/demo/runDemo.ts`: executable demo for local testing.

## Next steps
- Add a request scheduler for multi-session workloads.
- Integrate robots.txt parsing if required for your use case.
- Extend fingerprint profiles with OS-specific display metrics.
