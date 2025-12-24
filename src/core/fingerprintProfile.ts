export type FingerprintProfile = {
  userAgent: string;
  viewport: { width: number; height: number };
  timezoneId: string;
  locale: string;
  platform: string;
};

const fallbackProfile: FingerprintProfile = {
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  viewport: { width: 1512, height: 982 },
  timezoneId: "America/New_York",
  locale: "en-US",
  platform: "MacIntel"
};

export const fingerprintProfiles: FingerprintProfile[] = [
  fallbackProfile,
  {
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    viewport: { width: 1440, height: 900 },
    timezoneId: "America/Chicago",
    locale: "en-US",
    platform: "Win32"
  }
];

export const pickFingerprintProfile = (
  profiles: FingerprintProfile[] = fingerprintProfiles
): FingerprintProfile => {
  const index = Math.floor(Math.random() * profiles.length);
  return profiles[index] ?? fallbackProfile;
};
