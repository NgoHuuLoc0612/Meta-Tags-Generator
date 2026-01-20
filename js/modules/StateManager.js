/**
 * STATE MANAGER MODULE
 * Implements Observer Pattern for State Management
 */

export class StateManager {
    constructor() {
        this.state = {};
        this.subscribers = {};
        this.history = [];
        this.maxHistory = 50;
    }
    
    /**
     * Get state value
     */
    get(key) {
        return _.get(this.state, key);
    }
    
    /**
     * Set state value
     */
    set(key, value) {
        const oldValue = _.get(this.state, key);
        
        // Add to history
        this.addToHistory({
            type: 'SET',
            key,
            oldValue,
            newValue: value,
            timestamp: Date.now()
        });
        
        _.set(this.state, key, value);
        this.notify(key, value, oldValue);
    }
    
    /**
     * Update nested state
     */
    update(key, updates) {
        const current = this.get(key) || {};
        const newValue = { ...current, ...updates };
        this.set(key, newValue);
    }
    
    /**
     * Delete state value
     */
    delete(key) {
        const oldValue = _.get(this.state, key);
        
        this.addToHistory({
            type: 'DELETE',
            key,
            oldValue,
            timestamp: Date.now()
        });
        
        _.unset(this.state, key);
        this.notify(key, undefined, oldValue);
    }
    
    /**
     * Subscribe to state changes
     */
    subscribe(key, callback) {
        if (!this.subscribers[key]) {
            this.subscribers[key] = [];
        }
        
        this.subscribers[key].push(callback);
        
        // Return unsubscribe function
        return () => {
            this.unsubscribe(key, callback);
        };
    }
    
    /**
     * Unsubscribe from state changes
     */
    unsubscribe(key, callback) {
        if (this.subscribers[key]) {
            this.subscribers[key] = this.subscribers[key].filter(cb => cb !== callback);
        }
    }
    
    /**
     * Notify subscribers
     */
    notify(key, newValue, oldValue) {
        if (this.subscribers[key]) {
            this.subscribers[key].forEach(callback => {
                callback(newValue, oldValue);
            });
        }
        
        // Notify wildcard subscribers
        if (this.subscribers['*']) {
            this.subscribers['*'].forEach(callback => {
                callback(key, newValue, oldValue);
            });
        }
    }
    
    /**
     * Get entire state
     */
    getState() {
        return _.cloneDeep(this.state);
    }
    
    /**
     * Replace entire state
     */
    setState(newState) {
        const oldState = this.getState();
        
        this.addToHistory({
            type: 'REPLACE_STATE',
            oldValue: oldState,
            newValue: newState,
            timestamp: Date.now()
        });
        
        this.state = _.cloneDeep(newState);
        this.notify('*', newState, oldState);
    }
    
    /**
     * Clear all state
     */
    clear() {
        const oldState = this.getState();
        
        this.addToHistory({
            type: 'CLEAR',
            oldValue: oldState,
            timestamp: Date.now()
        });
        
        this.state = {};
        this.notify('*', {}, oldState);
    }
    
    /**
     * Add to history
     */
    addToHistory(entry) {
        this.history.push(entry);
        
        // Maintain max history size
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
    }
    
    /**
     * Get history
     */
    getHistory(limit = 10) {
        return this.history.slice(-limit);
    }
    
    /**
     * Undo last change
     */
    undo() {
        if (this.history.length === 0) {
            return false;
        }
        
        const lastChange = this.history.pop();
        
        switch (lastChange.type) {
            case 'SET':
            case 'UPDATE':
                if (lastChange.oldValue === undefined) {
                    _.unset(this.state, lastChange.key);
                } else {
                    _.set(this.state, lastChange.key, lastChange.oldValue);
                }
                this.notify(lastChange.key, lastChange.oldValue);
                break;
                
            case 'DELETE':
                _.set(this.state, lastChange.key, lastChange.oldValue);
                this.notify(lastChange.key, lastChange.oldValue);
                break;
                
            case 'CLEAR':
            case 'REPLACE_STATE':
                this.state = _.cloneDeep(lastChange.oldValue);
                this.notify('*', this.state);
                break;
        }
        
        return true;
    }
    
    /**
     * Compute derived state
     */
    computed(key, computeFn) {
        const dependencies = [];
        
        const proxy = new Proxy(this.state, {
            get: (target, prop) => {
                dependencies.push(prop);
                return _.get(target, prop);
            }
        });
        
        const value = computeFn(proxy);
        
        // Subscribe to all dependencies
        dependencies.forEach(dep => {
            this.subscribe(dep, () => {
                const newValue = computeFn(this.state);
                this.set(key, newValue);
            });
        });
        
        this.set(key, value);
        return value;
    }
    
    /**
     * Batch updates
     */
    batch(updateFn) {
        const notifications = [];
        const originalNotify = this.notify.bind(this);
        
        // Suppress notifications during batch
        this.notify = (key, newValue, oldValue) => {
            notifications.push({ key, newValue, oldValue });
        };
        
        updateFn(this);
        
        // Restore original notify
        this.notify = originalNotify;
        
        // Send all notifications at once
        notifications.forEach(({ key, newValue, oldValue }) => {
            this.notify(key, newValue, oldValue);
        });
    }
    
    /**
     * Persist state to storage
     */
    persist(key, storage = localStorage) {
        const stateData = JSON.stringify(this.state);
        storage.setItem(key, stateData);
    }
    
    /**
     * Restore state from storage
     */
    restore(key, storage = localStorage) {
        const stateData = storage.getItem(key);
        if (stateData) {
            try {
                const parsed = JSON.parse(stateData);
                this.setState(parsed);
                return true;
            } catch (error) {
                console.error('Failed to restore state:', error);
                return false;
            }
        }
        return false;
    }
    
    /**
     * Create selector
     */
    select(selectorFn) {
        return selectorFn(this.state);
    }
    
    /**
     * Middleware support
     */
    use(middleware) {
        const originalSet = this.set.bind(this);
        
        this.set = (key, value) => {
            const result = middleware({
                key,
                value,
                state: this.state,
                next: () => originalSet(key, value)
            });
            
            if (result !== false) {
                return result;
            }
        };
    }
}