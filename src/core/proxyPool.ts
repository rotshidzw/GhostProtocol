export type ProxyConfig = {
  server: string;
  username?: string;
  password?: string;
  countryHint?: string;
  cityHint?: string;
};

export class ProxyPool {
  private proxies: ProxyConfig[];
  private index = 0;

  constructor(proxies: ProxyConfig[]) {
    this.proxies = proxies;
  }

  next(): ProxyConfig | undefined {
    if (this.proxies.length === 0) {
      return undefined;
    }

    const proxy = this.proxies[this.index % this.proxies.length];
    this.index += 1;
    return proxy;
  }
}
