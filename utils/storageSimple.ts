/**
 * Simple localStorage Manager
 * No TTL, no encryption, just plain storage
 */

const PREFIX = 'loveinthecity_';

export class SimpleStorage {
  private static instance: SimpleStorage;

  static getInstance(): SimpleStorage {
    if (!SimpleStorage.instance) {
      SimpleStorage.instance = new SimpleStorage();
    }
    return SimpleStorage.instance;
  }

  /**
   * Save data to localStorage
   */
  set(key: string, value: any): boolean {
    try {
      const fullKey = PREFIX + key;
      const jsonValue = JSON.stringify(value);
      localStorage.setItem(fullKey, jsonValue);
      console.log(`✅ Saved: ${key}`, value);
      return true;
    } catch (error) {
      console.error(`❌ Failed to save ${key}:`, error);
      return false;
    }
  }

  /**
   * Get data from localStorage
   */
  get<T = any>(key: string, defaultValue?: T): T | null {
    try {
      const fullKey = PREFIX + key;
      const value = localStorage.getItem(fullKey);
      
      if (value === null) {
        console.log(`⚠️ Not found: ${key}`);
        return defaultValue || null;
      }
      
      const parsed = JSON.parse(value);
      console.log(`✅ Retrieved: ${key}`, parsed);
      return parsed as T;
    } catch (error) {
      console.error(`❌ Failed to get ${key}:`, error);
      return defaultValue || null;
    }
  }

  /**
   * Remove item from localStorage
   */
  remove(key: string): boolean {
    try {
      const fullKey = PREFIX + key;
      localStorage.removeItem(fullKey);
      console.log(`✅ Removed: ${key}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to remove ${key}:`, error);
      return false;
    }
  }

  /**
   * Clear all app data
   */
  clear(): boolean {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      console.log(`✅ Cleared all app data`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to clear storage:`, error);
      return false;
    }
  }

  /**
   * Check if key exists
   */
  has(key: string): boolean {
    const fullKey = PREFIX + key;
    return localStorage.getItem(fullKey) !== null;
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    const result: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(PREFIX)) {
        result.push(key.replace(PREFIX, ''));
      }
    }
    return result;
  }
}

// Export singleton instance
export const simpleStorage = SimpleStorage.getInstance();
