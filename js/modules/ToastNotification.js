/**
 * TOAST NOTIFICATION MODULE
 * Display toast notifications to users
 */

export class ToastNotification {
    constructor() {
        this.container = null;
        this.toasts = [];
        this.maxToasts = 5;
        this.defaultDuration = 4000;
        this.init();
    }
    
    /**
     * Initialize toast container
     */
    init() {
        this.container = document.getElementById('toastContainer');
        
        if (!this.container) {
            console.warn('Toast container not found');
        }
    }
    
    /**
     * Show toast notification
     */
    show(message, type = 'info', duration = this.defaultDuration) {
        if (!this.container) {
            console.warn('Cannot show toast: container not initialized');
            return null;
        }
        
        // Limit number of toasts
        if (this.toasts.length >= this.maxToasts) {
            this.removeOldest();
        }
        
        const toast = this.createToast(message, type);
        this.container.appendChild(toast);
        this.toasts.push(toast);
        
        // Trigger animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                this.remove(toast);
            }, duration);
        }
        
        return toast;
    }
    
    /**
     * Create toast element
     */
    createToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icon = this.getIcon(type);
        
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="${icon}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${this.getTitle(type)}</div>
                <div class="toast-message">${this.escapeHtml(message)}</div>
            </div>
            <button class="toast-close" aria-label="Close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add close button handler
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            this.remove(toast);
        });
        
        return toast;
    }
    
    /**
     * Get icon for toast type
     */
    getIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        return icons[type] || icons.info;
    }
    
    /**
     * Get title for toast type
     */
    getTitle(type) {
        const titles = {
            success: 'Success',
            error: 'Error',
            warning: 'Warning',
            info: 'Information'
        };
        
        return titles[type] || titles.info;
    }
    
    /**
     * Remove toast
     */
    remove(toast) {
        if (!toast || !toast.parentNode) return;
        
        toast.classList.add('removing');
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            
            const index = this.toasts.indexOf(toast);
            if (index > -1) {
                this.toasts.splice(index, 1);
            }
        }, 300);
    }
    
    /**
     * Remove oldest toast
     */
    removeOldest() {
        if (this.toasts.length > 0) {
            this.remove(this.toasts[0]);
        }
    }
    
    /**
     * Remove all toasts
     */
    removeAll() {
        this.toasts.forEach(toast => {
            this.remove(toast);
        });
    }
    
    /**
     * Success toast
     */
    success(message, duration) {
        return this.show(message, 'success', duration);
    }
    
    /**
     * Error toast
     */
    error(message, duration) {
        return this.show(message, 'error', duration);
    }
    
    /**
     * Warning toast
     */
    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }
    
    /**
     * Info toast
     */
    info(message, duration) {
        return this.show(message, 'info', duration);
    }
    
    /**
     * Escape HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Show loading toast
     */
    loading(message) {
        const toast = this.show(message, 'info', 0);
        toast.classList.add('toast-loading');
        
        const icon = toast.querySelector('.toast-icon i');
        icon.className = 'fas fa-spinner fa-spin';
        
        return {
            close: () => this.remove(toast),
            update: (newMessage) => {
                const messageEl = toast.querySelector('.toast-message');
                messageEl.textContent = newMessage;
            }
        };
    }
    
    /**
     * Show confirmation toast
     */
    confirm(message, onConfirm, onCancel) {
        const toast = this.createToast(message, 'warning');
        
        const actions = document.createElement('div');
        actions.className = 'toast-actions';
        actions.innerHTML = `
            <button class="btn btn-sm btn-primary confirm-btn">Confirm</button>
            <button class="btn btn-sm btn-secondary cancel-btn">Cancel</button>
        `;
        
        toast.querySelector('.toast-content').appendChild(actions);
        
        // Remove auto-close
        this.container.appendChild(toast);
        this.toasts.push(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Handle confirm
        const confirmBtn = toast.querySelector('.confirm-btn');
        confirmBtn.addEventListener('click', () => {
            if (onConfirm) onConfirm();
            this.remove(toast);
        });
        
        // Handle cancel
        const cancelBtn = toast.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', () => {
            if (onCancel) onCancel();
            this.remove(toast);
        });
        
        return toast;
    }
}