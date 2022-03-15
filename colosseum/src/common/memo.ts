export function memo<A extends any[], B>(
  f: (...args: A) => B
): (...args: A) => B {
  const cache = new Map<string, B>();
  return (...args: A) => {
    const hash = String([...args]);
    if (!cache.has(hash)) {
      cache.set(hash, f(...args));
    }
    return cache.get(hash)!;
  };
}
