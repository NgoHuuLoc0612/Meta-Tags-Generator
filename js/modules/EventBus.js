/**
 * EVENT BUS MODULE
 * Implements Publish-Subscribe Pattern
 */

export class EventBus {
    constructor() {
        this.events = new Map();
        this.onceEvents = new Map();
        this.middleware = [];
        this.eventHistory = [];
        this.maxHistory = 100;
    }
    
    /**
     * Subscribe to event
     */
    on(eventName, callback, priority = 0) {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }
        
        const listeners = this.events.get(eventName);
        listeners.push({ callback, priority });
        
        // Sort by priority (higher priority first)
        listeners.sort((a, b) => b.priority - a.priority);
        
        // Return unsubscribe function
        return () => this.off(eventName, callback);
    }
    
    /**
     * Subscribe to event once
     */
    once(eventName, callback) {
        if (!this.onceEvents.has(eventName)) {
            this.onceEvents.set(eventName, []);
        }
        
        this.onceEvents.get(eventName).push(callback);
        
        return () => {
            const callbacks = this.onceEvents.get(eventName);
            if (callbacks) {
                const index = callbacks.indexOf(callback);
                if (index > -1) {
                    callbacks.splice(index, 1);
                }
            }
        };
    }
    
    /**
     * Unsubscribe from event
     */
    off(eventName, callback) {
        if (this.events.has(eventName)) {
            const listeners = this.events.get(eventName);
            const filtered = listeners.filter(listener => listener.callback !== callback);
            
            if (filtered.length > 0) {
                this.events.set(eventName, filtered);
            } else {
                this.events.delete(eventName);
            }
        }
    }
    
    /**
     * Emit event
     */
    emit(eventName, data = null) {
        const event = {
            name: eventName,
            data,
            timestamp: Date.now(),
            propagationStopped: false
        };
        
        // Add to history
        this.addToHistory(event);
        
        // Run through middleware
        for (const mw of this.middleware) {
            const result = mw(event);
            if (result === false) {
                return; // Middleware cancelled event
            }
        }
        
        // Execute regular listeners
        if (this.events.has(eventName)) {
            const listeners = this.events.get(eventName);
            
            for (const listener of listeners) {
                if (event.propagationStopped) break;
                
                try {
                    listener.callback(data, event);
                } catch (error) {
                    console.error(`Error in event listener for ${eventName}:`, error);
                }
            }
        }
        
        // Execute once listeners
        if (this.onceEvents.has(eventName)) {
            const callbacks = this.onceEvents.get(eventName);
            this.onceEvents.delete(eventName);
            
            for (const callback of callbacks) {
                if (event.propagationStopped) break;
                
                try {
                    callback(data, event);
                } catch (error) {
                    console.error(`Error in once listener for ${eventName}:`, error);
                }
            }
        }
        
        // Execute wildcard listeners
        if (this.events.has('*')) {
            const wildcardListeners = this.events.get('*');
            
            for (const listener of wildcardListeners) {
                try {
                    listener.callback({ eventName, data }, event);
                } catch (error) {
                    console.error('Error in wildcard listener:', error);
                }
            }
        }
    }
    
    /**
     * Emit async event
     */
    async emitAsync(eventName, data = null) {
        const event = {
            name: eventName,
            data,
            timestamp: Date.now(),
            propagationStopped: false
        };
        
        this.addToHistory(event);
        
        // Run through middleware
        for (const mw of this.middleware) {
            const result = await mw(event);
            if (result === false) {
                return;
            }
        }
        
        const promises = [];
        
        // Execute regular listeners
        if (this.events.has(eventName)) {
            const listeners = this.events.get(eventName);
            
            for (const listener of listeners) {
                if (event.propagationStopped) break;
                promises.push(Promise.resolve(listener.callback(data, event)));
            }
        }
        
        // Execute once listeners
        if (this.onceEvents.has(eventName)) {
            const callbacks = this.onceEvents.get(eventName);
            this.onceEvents.delete(eventName);
            
            for (const callback of callbacks) {
                if (event.propagationStopped) break;
                promises.push(Promise.resolve(callback(data, event)));
            }
        }
        
        await Promise.all(promises);
    }
    
    /**
     * Stop event propagation
     */
    stopPropagation(event) {
        event.propagationStopped = true;
    }
    
    /**
     * Remove all listeners
     */
    removeAllListeners(eventName = null) {
        if (eventName) {
            this.events.delete(eventName);
            this.onceEvents.delete(eventName);
        } else {
            this.events.clear();
            this.onceEvents.clear();
        }
    }
    
    /**
     * Get listener count
     */
    listenerCount(eventName) {
        let count = 0;
        
        if (this.events.has(eventName)) {
            count += this.events.get(eventName).length;
        }
        
        if (this.onceEvents.has(eventName)) {
            count += this.onceEvents.get(eventName).length;
        }
        
        return count;
    }
    
    /**
     * Get all event names
     */
    eventNames() {
        const names = new Set();
        
        for (const name of this.events.keys()) {
            names.add(name);
        }
        
        for (const name of this.onceEvents.keys()) {
            names.add(name);
        }
        
        return Array.from(names);
    }
    
    /**
     * Add middleware
     */
    use(middleware) {
        this.middleware.push(middleware);
    }
    
    /**
     * Add to history
     */
    addToHistory(event) {
        this.eventHistory.push({
            ...event,
            historicalTimestamp: Date.now()
        });
        
        if (this.eventHistory.length > this.maxHistory) {
            this.eventHistory.shift();
        }
    }
    
    /**
     * Get event history
     */
    getHistory(eventName = null, limit = 10) {
        let history = this.eventHistory;
        
        if (eventName) {
            history = history.filter(e => e.name === eventName);
        }
        
        return history.slice(-limit);
    }
    
    /**
     * Clear history
     */
    clearHistory() {
        this.eventHistory = [];
    }
    
    /**
     * Debounce event
     */
    debounce(eventName, callback, delay = 300) {
        let timeoutId;
        
        return this.on(eventName, (data) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                callback(data);
            }, delay);
        });
    }
    
    /**
     * Throttle event
     */
    throttle(eventName, callback, limit = 300) {
        let inThrottle;
        
        return this.on(eventName, (data) => {
            if (!inThrottle) {
                callback(data);
                inThrottle = true;
                setTimeout(() => {
                    inThrottle = false;
                }, limit);
            }
        });
    }
    
    /**
     * Create event namespace
     */
    namespace(prefix) {
        return {
            on: (eventName, callback, priority) => {
                return this.on(`${prefix}:${eventName}`, callback, priority);
            },
            once: (eventName, callback) => {
                return this.once(`${prefix}:${eventName}`, callback);
            },
            emit: (eventName, data) => {
                return this.emit(`${prefix}:${eventName}`, data);
            },
            emitAsync: (eventName, data) => {
                return this.emitAsync(`${prefix}:${eventName}`, data);
            },
            off: (eventName, callback) => {
                return this.off(`${prefix}:${eventName}`, callback);
            }
        };
    }
    
    /**
     * Wait for event
     */
    waitFor(eventName, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                this.off(eventName, handler);
                reject(new Error(`Timeout waiting for event: ${eventName}`));
            }, timeout);
            
            const handler = (data) => {
                clearTimeout(timeoutId);
                resolve(data);
            };
            
            this.once(eventName, handler);
        });
    }
}