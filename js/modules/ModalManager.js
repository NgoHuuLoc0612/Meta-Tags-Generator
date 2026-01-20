/**
 * MODAL MANAGER MODULE
 * Manage modal dialogs and popups
 */

export class ModalManager {
    constructor() {
        this.container = null;
        this.activeModals = [];
        this.init();
    }
    
    /**
     * Initialize modal container
     */
    init() {
        this.container = document.getElementById('modalContainer');
        
        if (!this.container) {
            console.warn('Modal container not found');
        }
        
        // Handle ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModals.length > 0) {
                this.closeTopModal();
            }
        });
    }
    
    /**
     * Show modal
     */
    show(options = {}) {
        const {
            title = 'Modal',
            content = '',
            size = 'medium',
            showClose = true,
            buttons = [],
            onClose = null
        } = options;
        
        const modal = this.createModal({
            title,
            content,
            size,
            showClose,
            buttons,
            onClose
        });
        
        this.container.appendChild(modal);
        this.activeModals.push(modal);
        
        // Trigger animation
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // Focus first focusable element
        const focusable = modal.querySelector('button, input, select, textarea');
        if (focusable) {
            focusable.focus();
        }
        
        return modal;
    }
    
    /**
     * Create modal element
     */
    createModal(options) {
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        
        const sizeClass = `modal-${options.size}`;
        
        backdrop.innerHTML = `
            <div class="modal ${sizeClass}">
                <div class="modal-header">
                    <h3 class="modal-title">${this.escapeHtml(options.title)}</h3>
                    ${options.showClose ? `
                        <button class="modal-close" aria-label="Close">
                            <i class="fas fa-times"></i>
                        </button>
                    ` : ''}
                </div>
                <div class="modal-body">
                    ${typeof options.content === 'string' ? options.content : ''}
                </div>
                ${options.buttons && options.buttons.length > 0 ? `
                    <div class="modal-footer">
                        ${this.renderButtons(options.buttons)}
                    </div>
                ` : ''}
            </div>
        `;
        
        // Handle backdrop click
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                this.close(backdrop, options.onClose);
            }
        });
        
        // Handle close button
        if (options.showClose) {
            const closeBtn = backdrop.querySelector('.modal-close');
            closeBtn.addEventListener('click', () => {
                this.close(backdrop, options.onClose);
            });
        }
        
        // Handle button clicks
        options.buttons.forEach((button, index) => {
            const btn = backdrop.querySelector(`[data-button-index="${index}"]`);
            if (btn && button.onClick) {
                btn.addEventListener('click', () => {
                    const result = button.onClick();
                    if (result !== false) {
                        this.close(backdrop);
                    }
                });
            }
        });
        
        return backdrop;
    }
    
    /**
     * Render buttons
     */
    renderButtons(buttons) {
        return buttons.map((button, index) => {
            const className = button.className || 'btn-primary';
            return `
                <button 
                    class="btn ${className}" 
                    data-button-index="${index}"
                    ${button.disabled ? 'disabled' : ''}
                >
                    ${button.icon ? `<i class="${button.icon}"></i>` : ''}
                    ${this.escapeHtml(button.text)}
                </button>
            `;
        }).join('');
    }
    
    /**
     * Close modal
     */
    close(modal, onClose = null) {
        if (!modal || !modal.parentNode) return;
        
        modal.classList.remove('show');
        modal.classList.add('hiding');
        
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
            
            const index = this.activeModals.indexOf(modal);
            if (index > -1) {
                this.activeModals.splice(index, 1);
            }
            
            if (onClose) {
                onClose();
            }
        }, 300);
    }
    
    /**
     * Close top modal
     */
    closeTopModal() {
        if (this.activeModals.length > 0) {
            const topModal = this.activeModals[this.activeModals.length - 1];
            this.close(topModal);
        }
    }
    
    /**
     * Close all modals
     */
    closeAll() {
        [...this.activeModals].forEach(modal => {
            this.close(modal);
        });
    }
    
    /**
     * Confirm dialog
     */
    confirm(options = {}) {
        const {
            title = 'Confirm',
            message = 'Are you sure?',
            confirmText = 'Confirm',
            cancelText = 'Cancel',
            onConfirm = null,
            onCancel = null
        } = options;
        
        return this.show({
            title,
            content: `<p>${this.escapeHtml(message)}</p>`,
            buttons: [
                {
                    text: cancelText,
                    className: 'btn-secondary',
                    onClick: () => {
                        if (onCancel) onCancel();
                        return true;
                    }
                },
                {
                    text: confirmText,
                    className: 'btn-primary',
                    onClick: () => {
                        if (onConfirm) onConfirm();
                        return true;
                    }
                }
            ]
        });
    }
    
    /**
     * Alert dialog
     */
    alert(options = {}) {
        const {
            title = 'Alert',
            message = '',
            buttonText = 'OK',
            onClose = null
        } = options;
        
        return this.show({
            title,
            content: `<p>${this.escapeHtml(message)}</p>`,
            buttons: [
                {
                    text: buttonText,
                    className: 'btn-primary',
                    onClick: () => {
                        if (onClose) onClose();
                        return true;
                    }
                }
            ]
        });
    }
    
    /**
     * Prompt dialog
     */
    prompt(options = {}) {
        const {
            title = 'Input',
            message = '',
            placeholder = '',
            defaultValue = '',
            confirmText = 'OK',
            cancelText = 'Cancel',
            onConfirm = null,
            onCancel = null
        } = options;
        
        const inputId = 'prompt-input-' + Date.now();
        
        const modal = this.show({
            title,
            content: `
                <p>${this.escapeHtml(message)}</p>
                <input 
                    type="text" 
                    id="${inputId}"
                    class="form-input" 
                    placeholder="${this.escapeHtml(placeholder)}"
                    value="${this.escapeHtml(defaultValue)}"
                >
            `,
            buttons: [
                {
                    text: cancelText,
                    className: 'btn-secondary',
                    onClick: () => {
                        if (onCancel) onCancel();
                        return true;
                    }
                },
                {
                    text: confirmText,
                    className: 'btn-primary',
                    onClick: () => {
                        const input = document.getElementById(inputId);
                        if (onConfirm && input) {
                            onConfirm(input.value);
                        }
                        return true;
                    }
                }
            ]
        });
        
        // Focus input
        setTimeout(() => {
            const input = document.getElementById(inputId);
            if (input) {
                input.focus();
                input.select();
            }
        }, 100);
        
        return modal;
    }
    
    /**
     * Loading modal
     */
    loading(message = 'Loading...') {
        return this.show({
            title: '',
            content: `
                <div style="text-align: center; padding: 2rem;">
                    <i class="fas fa-spinner fa-spin fa-3x" style="color: var(--primary-color);"></i>
                    <p style="margin-top: 1rem; font-size: 1.1rem;">${this.escapeHtml(message)}</p>
                </div>
            `,
            showClose: false
        });
    }
    
    /**
     * Escape HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}