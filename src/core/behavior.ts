export type BehaviorOptions = {
  minDelayMs: number;
  maxDelayMs: number;
  jitterMs: number;
};

export const defaultBehavior: BehaviorOptions = {
  minDelayMs: 250,
  maxDelayMs: 1200,
  jitterMs: 120
};

export const randomDelay = async (options: BehaviorOptions = defaultBehavior) => {
  const base = options.minDelayMs + Math.random() * (options.maxDelayMs - options.minDelayMs);
  const jitter = (Math.random() - 0.5) * options.jitterMs;
  const duration = Math.max(0, Math.floor(base + jitter));

  await new Promise<void>((resolve) => setTimeout(resolve, duration));
};

export const toScrollSteps = (distance: number, step = 120) => {
  const steps = Math.max(1, Math.ceil(Math.abs(distance) / step));
  return { steps, delta: distance / steps };
};
