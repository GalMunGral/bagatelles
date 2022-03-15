export function memo(f) {
    const cache = new Map();
    return (...args) => {
        const hash = String([...args]);
        if (!cache.has(hash)) {
            cache.set(hash, f(...args));
        }
        return cache.get(hash);
    };
}
