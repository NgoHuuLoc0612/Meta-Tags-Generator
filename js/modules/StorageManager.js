/**
 * STORAGE MANAGER MODULE
 * Handles data persistence using in-memory storage
 */

export class StorageManager {
    constructor() {
        this.storage = new Map();
        this.namespace = 'metatags_';
        this.expirationTimes = new Map();
    }
    
    /**
     * Save data
     */
    save(key, data, ttl = null) {
        try {
            const fullKey = this.namespace + key;
            const serialized = JSON.stringify({
                data,
                timestamp: Date.now(),
                version: '2.0.0'
            });
            
            this.storage.set(fullKey, serialized);
            
            // Set expiration if TTL provided
            if (ttl) {
                this.expirationTimes.set(fullKey, Date.now() + ttl);
            }
            
            return true;
        } catch (error) {
            console.error('Storage save error:', error);
            return false;
        }
    }
    
    /**
     * Load data
     */
    load(key) {
        try {
            const fullKey = this.namespace + key;
            
            // Check expiration
            if (this.isExpired(fullKey)) {
                this.remove(key);
                return null;
            }
            
            const serialized = this.storage.get(fullKey);
            
            if (!serialized) {
                return null;
            }
            
            const parsed = JSON.parse(serialized);
            return parsed.data;
        } catch (error) {
            console.error('Storage load error:', error);
            return null;
        }
    }
    
    /**
     * Remove data
     */
    remove(key) {
        const fullKey = this.namespace + key;
        this.storage.delete(fullKey);
        this.expirationTimes.delete(fullKey);
    }
    
    /**
     * Clear all data
     */
    clear() {
        const keys = Array.from(this.storage.keys());
        keys.forEach(key => {
            if (key.startsWith(this.namespace)) {
                this.storage.delete(key);
            }
        });
        this.expirationTimes.clear();
    }
    
    /**
     * Check if key exists
     */
    has(key) {
        const fullKey = this.namespace + key;
        
        if (this.isExpired(fullKey)) {
            this.remove(key);
            return false;
        }
        
        return this.storage.has(fullKey);
    }
    
    /**
     * Get all keys
     */
    keys() {
        const allKeys = Array.from(this.storage.keys());
        return allKeys
            .filter(key => key.startsWith(this.namespace))
            .map(key => key.substring(this.namespace.length));
    }
    
    /**
     * Get storage size
     */
    size() {
        return this.keys().length;
    }
    
    /**
     * Check if expired
     */
    isExpired(fullKey) {
        const expiration = this.expirationTimes.get(fullKey);
        if (!expiration) return false;
        
        return Date.now() > expiration;
    }
    
    /**
     * Clean expired items
     */
    cleanExpired() {
        let cleaned = 0;
        
        for (const [key, expiration] of this.expirationTimes.entries()) {
            if (Date.now() > expiration) {
                this.storage.delete(key);
                this.expirationTimes.delete(key);
                cleaned++;
            }
        }
        
        return cleaned;
    }
    
    /**
     * Export all data
     */
    exportAll() {
        const data = {};
        
        this.keys().forEach(key => {
            data[key] = this.load(key);
        });
        
        return {
            version: '2.0.0',
            timestamp: new Date().toISOString(),
            data
        };
    }
    
    /**
     * Import data
     */
    importAll(importData) {
        if (!importData || !importData.data) {
            throw new Error('Invalid import data');
        }
        
        // Clear existing data
        this.clear();
        
        // Import new data
        Object.entries(importData.data).forEach(([key, value]) => {
            this.save(key, value);
        });
        
        return true;
    }
    
    /**
     * Get metadata about stored item
     */
    getMetadata(key) {
        try {
            const fullKey = this.namespace + key;
            const serialized = this.storage.get(fullKey);
            
            if (!serialized) return null;
            
            const parsed = JSON.parse(serialized);
            const expiration = this.expirationTimes.get(fullKey);
            
            return {
                timestamp: parsed.timestamp,
                version: parsed.version,
                size: serialized.length,
                expiration: expiration || null,
                expired: this.isExpired(fullKey)
            };
        } catch (error) {
            return null;
        }
    }
    
    /**
     * Update specific field in stored data
     */
    update(key, updates) {
        const current = this.load(key);
        
        if (!current) {
            return this.save(key, updates);
        }
        
        const merged = _.merge({}, current, updates);
        return this.save(key, merged);
    }
    
    /**
     * Get or set with default
     */
    getOrDefault(key, defaultValue) {
        const value = this.load(key);
        
        if (value === null) {
            this.save(key, defaultValue);
            return defaultValue;
        }
        
        return value;
    }
}