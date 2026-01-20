/**
 * META TAGS GENERATOR - MAIN APPLICATION
 * JavaScript Architecture
 * Version: 2.0.0
 */

// Import all modules
import { FormRenderer } from './modules/FormRenderer.js';
import { MetaGenerator } from './modules/MetaGenerator.js';
import { PreviewManager } from './modules/PreviewManager.js';
import { ValidationEngine } from './modules/ValidationEngine.js';
import { StorageManager } from './modules/StorageManager.js';
import { ThemeManager } from './modules/ThemeManager.js';
import { ToastNotification } from './modules/ToastNotification.js';
import { ModalManager } from './modules/ModalManager.js';
import { EventBus } from './modules/EventBus.js';
import { StateManager } from './modules/StateManager.js';
import { formCategories } from './data/formCategories.js';

/**
 * Main Application Class
 */
class MetaTagsApp {
    constructor() {
        this.state = new StateManager();
        this.eventBus = new EventBus();
        this.storage = new StorageManager();
        this.theme = new ThemeManager();
        this.toast = new ToastNotification();
        this.modal = new ModalManager();
        this.validator = new ValidationEngine();
        this.formRenderer = new FormRenderer(this.eventBus, this.validator);
        this.metaGenerator = new MetaGenerator();
        this.preview = new PreviewManager();
        
        this.currentCategory = 'basic';
        this.formData = {};
        
        this.init();
    }
    
    /**
     * Initialize Application
     */
    init() {
        console.log('🚀 Meta Tags Generator v2.0 - Enterprise Edition');
        
        // Initialize modules
        this.theme.init();
        this.setupEventListeners();
        this.loadSavedData();
        this.renderInitialForm();
        this.setupAutoSave();
        
        // Subscribe to state changes
        this.state.subscribe('formData', (data) => {
            this.handleFormDataChange(data);
        });
        
        this.toast.show('Application loaded successfully', 'success');
    }
    
    /**
     * Setup Event Listeners
     */
    setupEventListeners() {
        // Category navigation
        const categoryNav = document.getElementById('categoryNav');
        categoryNav.addEventListener('click', (e) => {
            const categoryBtn = e.target.closest('.category-item');
            if (categoryBtn) {
                const category = categoryBtn.dataset.category;
                this.switchCategory(category);
            }
        });
        
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', () => {
            this.theme.toggle();
            this.updateThemeIcon();
        });
        
        // Reset all
        const resetBtn = document.getElementById('resetAll');
        resetBtn.addEventListener('click', () => {
            this.handleReset();
        });
        
        // Export configuration
        const exportBtn = document.getElementById('exportConfig');
        exportBtn.addEventListener('click', () => {
            this.handleExport();
        });
        
        // Import configuration
        const importBtn = document.getElementById('importConfig');
        importBtn.addEventListener('click', () => {
            this.handleImport();
        });
        
        // Copy code
        const copyBtn = document.getElementById('copyCode');
        copyBtn.addEventListener('click', () => {
            this.handleCopyCode();
        });
        
        // Download HTML
        const downloadBtn = document.getElementById('downloadHtml');
        downloadBtn.addEventListener('click', () => {
            this.handleDownload();
        });
        
        // Preview type change
        const previewType = document.getElementById('previewType');
        previewType.addEventListener('change', (e) => {
            this.updatePreview();
        });
        
        // Listen to form changes via EventBus
        this.eventBus.on('formFieldChanged', (data) => {
            this.handleFieldChange(data);
        });
        
        // Listen to validation events
        this.eventBus.on('validationError', (error) => {
            this.toast.show(error.message, 'error');
        });
    }
    
    /**
     * Switch Category
     */
    switchCategory(category) {
        this.currentCategory = category;
        
        // Update navigation
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.toggle('active', item.dataset.category === category);
        });
        
        // Render form for category
        this.renderForm(category);
        
        // Update preview
        this.updatePreview();
    }
    
    /**
     * Render Initial Form
     */
    renderInitialForm() {
        this.renderForm('basic');
    }
    
    /**
     * Render Form for Category
     */
    renderForm(category) {
        const container = document.getElementById('formContainer');
        const categoryData = formCategories[category];
        
        if (!categoryData) {
            console.error(`Category not found: ${category}`);
            return;
        }
        
        const html = this.formRenderer.render(categoryData, this.formData);
        container.innerHTML = html;
        
        // Attach event listeners to form fields
        this.attachFormListeners(container);
    }
    
    /**
     * Attach Form Listeners
     */
    attachFormListeners(container) {
        const inputs = container.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            const eventType = input.type === 'checkbox' || input.type === 'radio' 
                ? 'change' 
                : 'input';
            
            input.addEventListener(eventType, (e) => {
                const field = e.target.name;
                const value = e.target.type === 'checkbox' 
                    ? e.target.checked 
                    : e.target.value;
                
                this.eventBus.emit('formFieldChanged', { field, value });
            });
            
            // Real-time validation
            input.addEventListener('blur', (e) => {
                this.validateField(e.target);
            });
        });
    }
    
    /**
     * Handle Field Change
     */
    handleFieldChange({ field, value }) {
        // Update form data
        this.formData[field] = value;
        
        // Update state
        this.state.set('formData', this.formData);
        
        // Generate and update preview
        this.updateCodeOutput();
        this.updatePreview();
        this.updateStats();
    }
    
    /**
     * Validate Field
     */
    validateField(field) {
        const validation = this.validator.validateField(field);
        
        if (!validation.valid) {
            this.showFieldError(field, validation.error);
        } else {
            this.clearFieldError(field);
        }
    }
    
    /**
     * Show Field Error
     */
    showFieldError(field, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        const existingError = field.parentElement.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }
        
        field.parentElement.appendChild(errorDiv);
        field.classList.add('error');
    }
    
    /**
     * Clear Field Error
     */
    clearFieldError(field) {
        const errorDiv = field.parentElement.querySelector('.form-error');
        if (errorDiv) {
            errorDiv.remove();
        }
        field.classList.remove('error');
    }
    
    /**
     * Handle Form Data Change
     */
    handleFormDataChange(data) {
        // Save to localStorage
        this.storage.save('metaFormData', data);
    }
    
    /**
     * Update Code Output
     */
    updateCodeOutput() {
        const metaTags = this.metaGenerator.generate(this.formData);
        const codeOutput = document.getElementById('codeOutput');
        
        codeOutput.textContent = metaTags;
        
        // Highlight code
        if (window.hljs) {
            window.hljs.highlightElement(codeOutput);
        }
    }
    
    /**
     * Update Preview
     */
    updatePreview() {
        const previewType = document.getElementById('previewType').value;
        const previewContainer = document.getElementById('livePreview');
        
        const previewHtml = this.preview.generate(this.formData, previewType);
        previewContainer.innerHTML = previewHtml;
    }
    
    /**
     * Update Statistics
     */
    updateStats() {
        const stats = this.metaGenerator.getStats(this.formData);
        const statsContainer = document.getElementById('metaStats');
        
        statsContainer.innerHTML = `
            <div class="stat-item">
                <span class="stat-label">Total Meta Tags:</span>
                <span class="stat-value badge badge-primary">${stats.totalTags}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">SEO Score:</span>
                <span class="stat-value badge badge-${stats.seoScore >= 80 ? 'success' : stats.seoScore >= 50 ? 'warning' : 'danger'}">
                    ${stats.seoScore}%
                </span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Character Count:</span>
                <span class="stat-value">${stats.charCount}</span>
            </div>
        `;
    }
    
    /**
     * Handle Reset
     */
    handleReset() {
        this.modal.confirm({
            title: 'Reset All Data',
            message: 'Are you sure you want to reset all form data? This action cannot be undone.',
            confirmText: 'Reset',
            cancelText: 'Cancel',
            onConfirm: () => {
                this.formData = {};
                this.state.set('formData', {});
                this.storage.clear();
                this.renderForm(this.currentCategory);
                this.updateCodeOutput();
                this.updatePreview();
                this.updateStats();
                this.toast.show('All data has been reset', 'success');
            }
        });
    }
    
    /**
     * Handle Export
     */
    handleExport() {
        const exportData = {
            version: '2.0.0',
            timestamp: new Date().toISOString(),
            data: this.formData
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `meta-config-${Date.now()}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.toast.show('Configuration exported successfully', 'success');
    }
    
    /**
     * Handle Import
     */
    handleImport() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    
                    if (data.data) {
                        this.formData = data.data;
                        this.state.set('formData', data.data);
                        this.renderForm(this.currentCategory);
                        this.updateCodeOutput();
                        this.updatePreview();
                        this.updateStats();
                        this.toast.show('Configuration imported successfully', 'success');
                    }
                } catch (error) {
                    this.toast.show('Invalid configuration file', 'error');
                }
            };
            
            reader.readAsText(file);
        });
        
        input.click();
    }
    
    /**
     * Handle Copy Code
     */
    handleCopyCode() {
        const codeOutput = document.getElementById('codeOutput');
        const text = codeOutput.textContent;
        
        navigator.clipboard.writeText(text).then(() => {
            this.toast.show('Code copied to clipboard', 'success');
        }).catch(() => {
            this.toast.show('Failed to copy code', 'error');
        });
    }
    
    /**
     * Handle Download
     */
    handleDownload() {
        const metaTags = this.metaGenerator.generate(this.formData);
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
${metaTags}
    <title>Generated Meta Tags</title>
</head>
<body>
    <!-- Your content here -->
</body>
</html>`;
        
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `meta-tags-${Date.now()}.html`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.toast.show('HTML file downloaded', 'success');
    }
    
    /**
     * Load Saved Data
     */
    loadSavedData() {
        const saved = this.storage.load('metaFormData');
        if (saved) {
            this.formData = saved;
            this.state.set('formData', saved);
        }
    }
    
    /**
     * Setup Auto-save
     */
    setupAutoSave() {
        setInterval(() => {
            if (Object.keys(this.formData).length > 0) {
                this.storage.save('metaFormData', this.formData);
            }
        }, 5000); // Auto-save every 5 seconds
    }
    
    /**
     * Update Theme Icon
     */
    updateThemeIcon() {
        const icon = document.querySelector('#themeToggle i');
        const isDark = document.documentElement.dataset.theme === 'dark';
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new MetaTagsApp();
    });
} else {
    window.app = new MetaTagsApp();
}