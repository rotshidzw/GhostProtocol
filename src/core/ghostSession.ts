import { chromium, type BrowserContextOptions, type Browser, type BrowserContext, type Page } from "playwright";
import { defaultBehavior, randomDelay, type BehaviorOptions } from "./behavior.js";
import { pickFingerprintProfile, type FingerprintProfile } from "./fingerprintProfile.js";
import { defaultPolicy, isUrlAllowed, type SessionPolicy } from "./sessionPolicy.js";
import type { ProxyConfig } from "./proxyPool.js";

export type GhostSessionOptions = {
  fingerprintProfile?: FingerprintProfile;
  proxy?: ProxyConfig;
  policy?: SessionPolicy;
  behavior?: BehaviorOptions;
};

export class GhostSession {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private options: GhostSessionOptions;
  private requestTimestamps: number[] = [];

  constructor(options: GhostSessionOptions = {}) {
    this.options = options;
  }

  async launch() {
    const fingerprint = this.options.fingerprintProfile ?? pickFingerprintProfile();
    const policy = { ...defaultPolicy, ...this.options.policy };

    const contextOptions: BrowserContextOptions = {
      userAgent: fingerprint.userAgent,
      viewport: fingerprint.viewport,
      locale: fingerprint.locale,
      timezoneId: fingerprint.timezoneId,
      geolocation: undefined
    };

    if (this.options.proxy) {
      contextOptions.proxy = {
        server: this.options.proxy.server,
        username: this.options.proxy.username,
        password: this.options.proxy.password
      };
    }

    this.browser = await chromium.launch({ headless: true });
    this.context = await this.browser.newContext(contextOptions);

    await this.context.addInitScript((platform) => {
      Object.defineProperty(navigator, "platform", { get: () => platform });
    }, fingerprint.platform);

    await this.context.route("**/*", async (route) => {
      if (!isUrlAllowed(route.request().url(), policy)) {
        await route.abort();
        return;
      }

      await route.continue();
    });

    return this.context;
  }

  async withPage<T>(fn: (page: Page) => Promise<T>) {
    if (!this.context) {
      throw new Error("GhostSession has not been launched.");
    }

    const page = await this.context.newPage();
    const result = await fn(page);
    await page.close();
    return result;
  }

  async throttle() {
    const policy = { ...defaultPolicy, ...this.options.policy };
    const now = Date.now();
    const windowStart = now - 60_000;

    this.requestTimestamps = this.requestTimestamps.filter((timestamp) => timestamp > windowStart);

    if (this.requestTimestamps.length >= policy.maxRequestsPerMinute) {
      const waitTime = this.requestTimestamps[0]! + 60_000 - now;
      await new Promise<void>((resolve) => setTimeout(resolve, waitTime));
    }

    this.requestTimestamps.push(Date.now());
  }

  async humanPause() {
    await randomDelay(this.options.behavior ?? defaultBehavior);
  }

  async close() {
    await this.context?.close();
    await this.browser?.close();
    this.context = null;
    this.browser = null;
  }
}
