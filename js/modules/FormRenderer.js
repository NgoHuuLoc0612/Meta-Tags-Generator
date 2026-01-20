/**
 * FORM RENDERER MODULE
 * Dynamically renders form fields based on category configuration
 */

export class FormRenderer {
    constructor(eventBus, validator) {
        this.eventBus = eventBus;
        this.validator = validator;
    }
    
    /**
     * Render complete form category
     */
    render(categoryData, formData = {}) {
        const { title, description, fields } = categoryData;
        
        const html = `
            <div class="form-category active">
                <div class="category-header">
                    <h2>${title}</h2>
                    <p>${description}</p>
                </div>
                
                <div class="form-body">
                    ${this.renderFields(fields, formData)}
                </div>
            </div>
        `;
        
        return html;
    }
    
    /**
     * Render all fields
     */
    renderFields(fields, formData) {
        return fields.map(field => this.renderField(field, formData)).join('');
    }
    
    /**
     * Render single field
     */
    renderField(field, formData) {
        const value = formData[field.name] || field.value || '';
        
        // Check conditional rendering
        if (field.condition) {
            const conditionMet = formData[field.condition.field] === field.condition.value;
            if (!conditionMet) {
                return '';
            }
        }
        
        const fieldHtml = this.renderFieldByType(field, value);
        
        return `
            <div class="form-group" data-field="${field.name}">
                ${this.renderLabel(field)}
                ${fieldHtml}
                ${field.help ? this.renderHelp(field.help) : ''}
            </div>
        `;
    }
    
    /**
     * Render field label
     */
    renderLabel(field) {
        const requiredClass = field.required ? 'label-required' : '';
        const icon = field.icon ? `<i class="${field.icon}"></i>` : '';
        
        return `
            <label class="form-label ${requiredClass}" for="${field.name}">
                ${icon}
                ${field.label}
            </label>
        `;
    }
    
    /**
     * Render help text
     */
    renderHelp(helpText) {
        return `<div class="form-help">${helpText}</div>`;
    }
    
    /**
     * Render field by type
     */
    renderFieldByType(field, value) {
        switch (field.type) {
            case 'text':
            case 'url':
            case 'email':
            case 'tel':
            case 'number':
            case 'date':
            case 'datetime-local':
                return this.renderInput(field, value);
                
            case 'textarea':
                return this.renderTextarea(field, value);
                
            case 'select':
                return this.renderSelect(field, value);
                
            case 'checkbox':
                return this.renderCheckbox(field, value);
                
            case 'radio':
                return this.renderRadio(field, value);
                
            case 'color':
                return this.renderColorPicker(field, value);
                
            default:
                return this.renderInput(field, value);
        }
    }
    
    /**
     * Render text input
     */
    renderInput(field, value) {
        const attrs = [
            `type="${field.type}"`,
            `id="${field.name}"`,
            `name="${field.name}"`,
            `class="form-input"`,
            field.placeholder ? `placeholder="${field.placeholder}"` : '',
            field.required ? 'required' : '',
            field.maxLength ? `maxlength="${field.maxLength}"` : '',
            field.min !== undefined ? `min="${field.min}"` : '',
            field.max !== undefined ? `max="${field.max}"` : '',
            field.pattern ? `pattern="${field.pattern}"` : '',
            `value="${this.escapeHtml(value)}"`
        ].filter(Boolean).join(' ');
        
        let html = `<input ${attrs}>`;
        
        // Add character counter for text fields with maxLength
        if (field.maxLength && (field.type === 'text' || field.type === 'textarea')) {
            html += `
                <div class="char-counter">
                    <span class="current-chars">${value.length}</span> / ${field.maxLength}
                </div>
            `;
        }
        
        return html;
    }
    
    /**
     * Render textarea
     */
    renderTextarea(field, value) {
        const attrs = [
            `id="${field.name}"`,
            `name="${field.name}"`,
            `class="form-textarea"`,
            field.placeholder ? `placeholder="${field.placeholder}"` : '',
            field.required ? 'required' : '',
            field.maxLength ? `maxlength="${field.maxLength}"` : '',
            field.rows ? `rows="${field.rows}"` : 'rows="4"'
        ].filter(Boolean).join(' ');
        
        let html = `<textarea ${attrs}>${this.escapeHtml(value)}</textarea>`;
        
        // Add character counter
        if (field.maxLength) {
            html += `
                <div class="char-counter">
                    <span class="current-chars">${value.length}</span> / ${field.maxLength}
                </div>
            `;
        }
        
        return html;
    }
    
    /**
     * Render select dropdown
     */
    renderSelect(field, value) {
        const attrs = [
            `id="${field.name}"`,
            `name="${field.name}"`,
            `class="form-select"`,
            field.required ? 'required' : ''
        ].filter(Boolean).join(' ');
        
        const options = field.options.map(opt => {
            const selected = opt.value === value ? 'selected' : '';
            return `<option value="${opt.value}" ${selected}>${opt.label}</option>`;
        }).join('');
        
        return `<select ${attrs}>${options}</select>`;
    }
    
    /**
     * Render checkbox
     */
    renderCheckbox(field, value) {
        const checked = value || field.checked ? 'checked' : '';
        
        return `
            <div class="checkbox-item">
                <input 
                    type="checkbox" 
                    id="${field.name}" 
                    name="${field.name}" 
                    ${checked}
                >
                <label for="${field.name}">${field.label}</label>
            </div>
        `;
    }
    
    /**
     * Render radio buttons
     */
    renderRadio(field, value) {
        if (!field.options) return '';
        
        return `
            <div class="radio-group">
                ${field.options.map((opt, index) => {
                    const checked = opt.value === value ? 'checked' : '';
                    const radioId = `${field.name}_${index}`;
                    
                    return `
                        <div class="radio-item">
                            <input 
                                type="radio" 
                                id="${radioId}" 
                                name="${field.name}" 
                                value="${opt.value}"
                                ${checked}
                            >
                            <label for="${radioId}">${opt.label}</label>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    /**
     * Render color picker
     */
    renderColorPicker(field, value) {
        const color = value || field.value || '#000000';
        
        return `
            <div class="color-picker-wrapper">
                <input 
                    type="color" 
                    id="${field.name}" 
                    name="${field.name}" 
                    value="${color}"
                >
                <input 
                    type="text" 
                    class="form-input color-value" 
                    value="${color}"
                    pattern="^#[0-9A-Fa-f]{6}$"
                    placeholder="#000000"
                >
            </div>
        `;
    }
    
    /**
     * Escape HTML
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Render validation message
     */
    renderValidation(field, isValid, message) {
        if (isValid) return '';
        
        return `
            <div class="form-error">
                <i class="fas fa-exclamation-circle"></i>
                ${message}
            </div>
        `;
    }
}