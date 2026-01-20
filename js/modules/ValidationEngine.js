/**
 * VALIDATION ENGINE MODULE
 * Comprehensive form validation with multiple validation rules
 */

export class ValidationEngine {
    constructor() {
        this.rules = {
            required: this.validateRequired.bind(this),
            email: this.validateEmail.bind(this),
            url: this.validateURL.bind(this),
            minLength: this.validateMinLength.bind(this),
            maxLength: this.validateMaxLength.bind(this),
            pattern: this.validatePattern.bind(this),
            number: this.validateNumber.bind(this),
            tel: this.validateTel.bind(this),
            color: this.validateColor.bind(this),
            date: this.validateDate.bind(this)
        };
        
        this.customRules = {};
        this.messages = {
            required: 'This field is required',
            email: 'Please enter a valid email address',
            url: 'Please enter a valid URL',
            minLength: 'Minimum length is {min} characters',
            maxLength: 'Maximum length is {max} characters',
            pattern: 'Please match the requested format',
            number: 'Please enter a valid number',
            tel: 'Please enter a valid phone number',
            color: 'Please enter a valid color code',
            date: 'Please enter a valid date'
        };
    }
    
    /**
     * Validate a field
     */
    validateField(field, value = null) {
        const fieldValue = value !== null ? value : field.value;
        const fieldType = field.type || 'text';
        const errors = [];
        
        // Check required
        if (field.required && this.isEmpty(fieldValue)) {
            return {
                valid: false,
                error: this.messages.required
            };
        }
        
        // Skip validation if field is empty and not required
        if (this.isEmpty(fieldValue) && !field.required) {
            return { valid: true };
        }
        
        // Type-specific validation
        switch (fieldType) {
            case 'email':
                if (!this.validateEmail(fieldValue)) {
                    errors.push(this.messages.email);
                }
                break;
                
            case 'url':
                if (!this.validateURL(fieldValue)) {
                    errors.push(this.messages.url);
                }
                break;
                
            case 'tel':
                if (!this.validateTel(fieldValue)) {
                    errors.push(this.messages.tel);
                }
                break;
                
            case 'number':
                if (!this.validateNumber(fieldValue)) {
                    errors.push(this.messages.number);
                }
                break;
                
            case 'color':
                if (!this.validateColor(fieldValue)) {
                    errors.push(this.messages.color);
                }
                break;
                
            case 'date':
            case 'datetime-local':
                if (!this.validateDate(fieldValue)) {
                    errors.push(this.messages.date);
                }
                break;
        }
        
        // Check min/max length
        if (field.minLength && fieldValue.length < field.minLength) {
            errors.push(this.messages.minLength.replace('{min}', field.minLength));
        }
        
        if (field.maxLength && fieldValue.length > field.maxLength) {
            errors.push(this.messages.maxLength.replace('{max}', field.maxLength));
        }
        
        // Check pattern
        if (field.pattern && !this.validatePattern(fieldValue, field.pattern)) {
            errors.push(this.messages.pattern);
        }
        
        // Check min/max for numbers
        if (fieldType === 'number') {
            const numValue = parseFloat(fieldValue);
            
            if (field.min !== undefined && numValue < field.min) {
                errors.push(`Minimum value is ${field.min}`);
            }
            
            if (field.max !== undefined && numValue > field.max) {
                errors.push(`Maximum value is ${field.max}`);
            }
        }
        
        // Custom validation
        if (field.validate && typeof field.validate === 'function') {
            const customResult = field.validate(fieldValue);
            if (customResult !== true) {
                errors.push(customResult || 'Validation failed');
            }
        }
        
        return {
            valid: errors.length === 0,
            error: errors[0] || null,
            errors
        };
    }
    
    /**
     * Validate entire form
     */
    validateForm(formData, fields) {
        const errors = {};
        let isValid = true;
        
        for (const field of fields) {
            const value = formData[field.name];
            const result = this.validateField({ ...field, value });
            
            if (!result.valid) {
                errors[field.name] = result.error;
                isValid = false;
            }
        }
        
        return {
            valid: isValid,
            errors
        };
    }
    
    /**
     * Check if value is empty
     */
    isEmpty(value) {
        return value === null || 
               value === undefined || 
               value === '' || 
               (Array.isArray(value) && value.length === 0);
    }
    
    /**
     * Validate required field
     */
    validateRequired(value) {
        return !this.isEmpty(value);
    }
    
    /**
     * Validate email
     */
    validateEmail(value) {
        if (!value) return true;
        
        // Use validator.js if available
        if (window.validator && window.validator.isEmail) {
            return window.validator.isEmail(value);
        }
        
        // Fallback regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    }
    
    /**
     * Validate URL
     */
    validateURL(value) {
        if (!value) return true;
        
        // Use validator.js if available
        if (window.validator && window.validator.isURL) {
            return window.validator.isURL(value, {
                protocols: ['http', 'https'],
                require_protocol: true
            });
        }
        
        // Fallback regex
        try {
            new URL(value);
            return true;
        } catch {
            return false;
        }
    }
    
    /**
     * Validate telephone
     */
    validateTel(value) {
        if (!value) return true;
        
        // Basic international phone number validation
        const telRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
        return telRegex.test(value);
    }
    
    /**
     * Validate number
     */
    validateNumber(value) {
        if (value === '') return true;
        return !isNaN(parseFloat(value)) && isFinite(value);
    }
    
    /**
     * Validate color
     */
    validateColor(value) {
        if (!value) return true;
        
        // Hex color validation
        const hexRegex = /^#[0-9A-Fa-f]{6}$/;
        return hexRegex.test(value);
    }
    
    /**
     * Validate date
     */
    validateDate(value) {
        if (!value) return true;
        
        const date = new Date(value);
        return date instanceof Date && !isNaN(date);
    }
    
    /**
     * Validate min length
     */
    validateMinLength(value, min) {
        if (!value) return true;
        return value.length >= min;
    }
    
    /**
     * Validate max length
     */
    validateMaxLength(value, max) {
        if (!value) return true;
        return value.length <= max;
    }
    
    /**
     * Validate pattern
     */
    validatePattern(value, pattern) {
        if (!value) return true;
        const regex = new RegExp(pattern);
        return regex.test(value);
    }
    
    /**
     * Add custom validation rule
     */
    addRule(name, validator, message) {
        this.customRules[name] = validator;
        if (message) {
            this.messages[name] = message;
        }
    }
    
    /**
     * Sanitize input
     */
    sanitize(value, type = 'text') {
        if (!value) return value;
        
        switch (type) {
            case 'email':
                return value.toLowerCase().trim();
                
            case 'url':
                return value.trim();
                
            case 'text':
            case 'textarea':
                // Remove potentially dangerous characters
                return value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                
            case 'number':
                return parseFloat(value);
                
            default:
                return value;
        }
    }
    
    /**
     * Validate SEO requirements
     */
    validateSEO(data) {
        const issues = [];
        const recommendations = [];
        
        // Title validation
        if (!data.title) {
            issues.push('Missing page title');
        } else {
            if (data.title.length < 30) {
                recommendations.push('Title is too short (recommended: 50-60 characters)');
            }
            if (data.title.length > 60) {
                recommendations.push('Title is too long (recommended: 50-60 characters)');
            }
        }
        
        // Description validation
        if (!data.description) {
            issues.push('Missing meta description');
        } else {
            if (data.description.length < 120) {
                recommendations.push('Description is too short (recommended: 120-160 characters)');
            }
            if (data.description.length > 160) {
                recommendations.push('Description is too long (recommended: 120-160 characters)');
            }
        }
        
        // Open Graph validation
        if (!data.og_image) {
            recommendations.push('Missing Open Graph image');
        }
        
        if (!data.og_title) {
            recommendations.push('Missing Open Graph title');
        }
        
        // Twitter Card validation
        if (!data.twitter_card) {
            recommendations.push('Missing Twitter Card type');
        }
        
        if (!data.twitter_image) {
            recommendations.push('Missing Twitter Card image');
        }
        
        // Canonical URL
        if (!data.canonical) {
            recommendations.push('Missing canonical URL');
        }
        
        return {
            valid: issues.length === 0,
            issues,
            recommendations,
            score: this.calculateSEOScore(data)
        };
    }
    
    /**
     * Calculate SEO score
     */
    calculateSEOScore(data) {
        let score = 0;
        
        // Basic meta (30 points)
        if (data.title && data.title.length >= 30 && data.title.length <= 60) score += 15;
        else if (data.title) score += 5;
        
        if (data.description && data.description.length >= 120 && data.description.length <= 160) score += 15;
        else if (data.description) score += 5;
        
        // Open Graph (25 points)
        if (data.og_title) score += 5;
        if (data.og_description) score += 5;
        if (data.og_image) score += 10;
        if (data.og_url) score += 5;
        
        // Twitter (15 points)
        if (data.twitter_card) score += 5;
        if (data.twitter_title) score += 5;
        if (data.twitter_image) score += 5;
        
        // SEO (20 points)
        if (data.canonical) score += 10;
        if (data.robots) score += 5;
        if (data.language) score += 5;
        
        // Schema (10 points)
        if (data.schema_type) score += 10;
        
        return Math.min(score, 100);
    }
}