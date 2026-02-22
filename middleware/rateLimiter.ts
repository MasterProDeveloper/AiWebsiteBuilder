const rateMap = new Map();

export function rateLimiter(req: any, res: any, next: any) {

  const ip = req.ip;

  const now = Date.now();
  const windowMs = 60 * 1000;
  const limit = 100;

  if (!rateMap.has(ip)) {
    rateMap.set(ip, []);
  }

  const timestamps = rateMap.get(ip).filter(
    (time: number) => now - time < windowMs
  );

  if (timestamps.length >= limit) {
    return res.status(429).json({ error: "Too many requests" });
  }

  timestamps.push(now);
  rateMap.set(ip, timestamps);

  next();
}
