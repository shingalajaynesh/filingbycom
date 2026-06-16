class MemoryCache {
  constructor() {
    this.cache = new Map();
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if item has expired (using TTL)
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  set(key, value, ttlMs = 5 * 60 * 1000) { // Default TTL: 5 minutes
    const expiresAt = Date.now() + ttlMs;
    this.cache.set(key, { value, expiresAt });
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }
}

export const serviceCache = new MemoryCache();
export const settingCache = new MemoryCache();
export const locationCache = new MemoryCache();
