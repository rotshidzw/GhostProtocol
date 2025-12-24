export type SessionPolicy = {
  allowList?: string[];
  blockList?: string[];
  maxRequestsPerMinute: number;
  maxConcurrentSessions: number;
  respectRobotsTxt: boolean;
};

export const defaultPolicy: SessionPolicy = {
  allowList: [],
  blockList: [],
  maxRequestsPerMinute: 30,
  maxConcurrentSessions: 3,
  respectRobotsTxt: true
};

export const isUrlAllowed = (url: string, policy: SessionPolicy): boolean => {
  const { allowList, blockList } = policy;

  if (blockList && blockList.some((entry) => url.includes(entry))) {
    return false;
  }

  if (allowList && allowList.length > 0) {
    return allowList.some((entry) => url.includes(entry));
  }

  return true;
};
