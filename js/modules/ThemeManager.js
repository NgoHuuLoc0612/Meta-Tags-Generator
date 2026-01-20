/**
 * THEME MANAGER MODULE
 * Handles light/dark theme switching and persistence
 */

export class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.storageKey = 'theme_preference';
        this.themes = {
            light: {
                name: 'Light',
                class: 'light'
            },
            dark: {
                name: 'Dark',
                class: 'dark'
            }
        };
    }
    
    /**
     * Initialize theme
     */
    init() {
        // Load saved theme preference
        this.loadTheme();
        
        // Listen for system theme changes
        this.listenForSystemThemeChanges();
        
        // Apply initial theme
        this.apply(this.currentTheme);
    }
    
    /**
     * Load theme from storage or system preference
     */
    loadTheme() {
        // Try to load from storage (in-memory)
        const stored = this.getStoredTheme();
        
        if (stored && this.themes[stored]) {
            this.currentTheme = stored;
        } else {
            // Fallback to system preference
            this.currentTheme = this.getSystemTheme();
        }
    }
    
    /**
     * Get stored theme
     */
    getStoredTheme() {
        // Use in-memory storage
        const stored = sessionStorage.getItem(this.storageKey);
        return stored;
    }
    
    /**
     * Get system theme preference
     */
    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }
    
    /**
     * Apply theme
     */
    apply(themeName) {
        if (!this.themes[themeName]) {
            console.error(`Theme "${themeName}" not found`);
            return;
        }
        
        const html = document.documentElement;
        
        // Remove all theme classes
        Object.values(this.themes).forEach(theme => {
            html.classList.remove(theme.class);
        });
        
        // Add current theme class
        if (themeName !== 'light') {
            html.classList.add(this.themes[themeName].class);
        }
        
        // Set data attribute
        html.dataset.theme = themeName;
        
        // Update current theme
        this.currentTheme = themeName;
        
        // Save preference
        this.saveTheme(themeName);
        
        // Dispatch event
        this.dispatchThemeChange(themeName);
    }
    
    /**
     * Save theme preference
     */
    saveTheme(themeName) {
        try {
            sessionStorage.setItem(this.storageKey, themeName);
        } catch (error) {
            console.error('Failed to save theme:', error);
        }
    }
    
    /**
     * Toggle between themes
     */
    toggle() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.apply(newTheme);
        return newTheme;
    }
    
    /**
     * Get current theme
     */
    getCurrent() {
        return this.currentTheme;
    }
    
    /**
     * Listen for system theme changes
     */
    listenForSystemThemeChanges() {
        if (!window.matchMedia) return;
        
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Modern browsers
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', (e) => {
                // Only auto-switch if no manual preference set
                if (!this.getStoredTheme()) {
                    const newTheme = e.matches ? 'dark' : 'light';
                    this.apply(newTheme);
                }
            });
        }
        // Older browsers
        else if (mediaQuery.addListener) {
            mediaQuery.addListener((e) => {
                if (!this.getStoredTheme()) {
                    const newTheme = e.matches ? 'dark' : 'light';
                    this.apply(newTheme);
                }
            });
        }
    }
    
    /**
     * Dispatch theme change event
     */
    dispatchThemeChange(themeName) {
        const event = new CustomEvent('themechange', {
            detail: {
                theme: themeName,
                timestamp: Date.now()
            }
        });
        
        window.dispatchEvent(event);
    }
    
    /**
     * Register theme change listener
     */
    onChange(callback) {
        window.addEventListener('themechange', (e) => {
            callback(e.detail.theme);
        });
    }
    
    /**
     * Get theme colors
     */
    getColors() {
        const html = document.documentElement;
        const computed = getComputedStyle(html);
        
        return {
            primary: computed.getPropertyValue('--primary-color').trim(),
            secondary: computed.getPropertyValue('--secondary-color').trim(),
            background: computed.getPropertyValue('--bg-primary').trim(),
            text: computed.getPropertyValue('--text-primary').trim()
        };
    }
    
    /**
     * Set custom theme colors
     */
    setColors(colors) {
        const html = document.documentElement;
        
        Object.entries(colors).forEach(([key, value]) => {
            const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            html.style.setProperty(cssVar, value);
        });
    }
    
    /**
     * Reset to default colors
     */
    resetColors() {
        const html = document.documentElement;
        
        const colorVars = [
            '--primary-color',
            '--secondary-color',
            '--bg-primary',
            '--text-primary'
        ];
        
        colorVars.forEach(varName => {
            html.style.removeProperty(varName);
        });
    }
}