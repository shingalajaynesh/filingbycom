class MemoryCache {
  #cache = new Map();
  #maxSize = 100;

  get(key) {
    const item = this.#cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.#cache.delete(key);
      return null;
    }
    return item.value;
  }

  set(key, value, ttlMs = 300000) {
    // Lazy cleanup of expired items on write to keep memory footprint minimal
    for (const [k, item] of this.#cache.entries()) {
      if (Date.now() > item.expiresAt) {
        this.#cache.delete(k);
      }
    }

    // Limit cache size to prevent memory leaks
    if (this.#cache.size >= this.#maxSize) {
      const oldestKey = this.#cache.keys().next().value;
      this.#cache.delete(oldestKey);
    }

    this.#cache.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  delete(key) {
    this.#cache.delete(key);
  }

  clear() {
    this.#cache.clear();
  }
}

export const serviceCache = new MemoryCache();
export const settingCache = new MemoryCache();
export const locationCache = new MemoryCache();
