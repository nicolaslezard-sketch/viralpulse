export async function withRetry<T>(
  fn: () => Promise<T>,
  opts?: {
    retries?: number;
    baseDelayMs?: number;
    shouldRetry?: (err: unknown) => boolean;
  }
): Promise<T> {
  const retries = opts?.retries ?? 2;
  const baseDelayMs = opts?.baseDelayMs ?? 600;

  let lastErr: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const ok = opts?.shouldRetry ? opts.shouldRetry(err) : true;
      if (!ok || attempt === retries) break;

      const delay = baseDelayMs * Math.pow(2, attempt);
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  throw lastErr;
}
