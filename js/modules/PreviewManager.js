/**
 * PREVIEW MANAGER MODULE
 * Generate live previews for different platforms
 */

export class PreviewManager {
    constructor() {
        this.previewGenerators = {
            google: this.generateGooglePreview.bind(this),
            facebook: this.generateFacebookPreview.bind(this),
            twitter: this.generateTwitterPreview.bind(this),
            linkedin: this.generateLinkedInPreview.bind(this)
        };
    }
    
    /**
     * Generate preview based on type
     */
    generate(data, type = 'google') {
        const generator = this.previewGenerators[type];
        
        if (!generator) {
            return `<p>Preview type "${type}" not found</p>`;
        }
        
        return generator(data);
    }
    
    /**
     * Generate Google Search preview
     */
    generateGooglePreview(data) {
        const title = data.title || 'Untitled Page';
        const description = data.description || 'No description available';
        const url = data.canonical || 'https://example.com';
        
        // Extract domain
        let domain = 'example.com';
        try {
            domain = new URL(url).hostname;
        } catch (e) {
            // Invalid URL, use default
        }
        
        // Truncate title and description
        const truncatedTitle = this.truncate(title, 60);
        const truncatedDesc = this.truncate(description, 160);
        
        return `
            <div class="preview-google" style="
                font-family: Arial, sans-serif;
                max-width: 600px;
                padding: 1rem;
                background: white;
                border-radius: 8px;
            ">
                <div style="
                    color: #202124;
                    font-size: 12px;
                    line-height: 1.3;
                    margin-bottom: 2px;
                ">
                    ${this.escapeHtml(domain)}
                </div>
                <div style="
                    color: #1a0dab;
                    font-size: 20px;
                    line-height: 1.3;
                    margin-bottom: 3px;
                    cursor: pointer;
                    font-weight: 400;
                ">
                    ${this.escapeHtml(truncatedTitle)}
                </div>
                <div style="
                    color: #4d5156;
                    font-size: 14px;
                    line-height: 1.58;
                ">
                    ${this.escapeHtml(truncatedDesc)}
                </div>
            </div>
        `;
    }
    
    /**
     * Generate Facebook preview
     */
    generateFacebookPreview(data) {
        const title = data.og_title || data.title || 'Untitled';
        const description = data.og_description || data.description || '';
        const image = data.og_image || '';
        const siteName = data.og_site_name || '';
        
        const truncatedTitle = this.truncate(title, 100);
        const truncatedDesc = this.truncate(description, 200);
        
        return `
            <div class="preview-facebook" style="
                font-family: Helvetica, Arial, sans-serif;
                max-width: 500px;
                border: 1px solid #dddfe2;
                border-radius: 3px;
                overflow: hidden;
                background: white;
            ">
                ${image ? `
                    <div style="
                        width: 100%;
                        height: 260px;
                        background: #f0f2f5;
                        background-image: url('${this.escapeHtml(image)}');
                        background-size: cover;
                        background-position: center;
                    "></div>
                ` : `
                    <div style="
                        width: 100%;
                        height: 260px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 48px;
                    ">
                        <i class="fas fa-image"></i>
                    </div>
                `}
                <div style="padding: 10px 12px; background: #f0f2f5;">
                    ${siteName ? `
                        <div style="
                            font-size: 12px;
                            color: #606770;
                            text-transform: uppercase;
                            margin-bottom: 5px;
                        ">
                            ${this.escapeHtml(siteName)}
                        </div>
                    ` : ''}
                    <div style="
                        font-size: 16px;
                        font-weight: 600;
                        color: #1c1e21;
                        margin-bottom: 5px;
                        line-height: 20px;
                    ">
                        ${this.escapeHtml(truncatedTitle)}
                    </div>
                    ${description ? `
                        <div style="
                            font-size: 14px;
                            color: #606770;
                            line-height: 20px;
                        ">
                            ${this.escapeHtml(truncatedDesc)}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    /**
     * Generate Twitter Card preview
     */
    generateTwitterPreview(data) {
        const cardType = data.twitter_card || 'summary_large_image';
        const title = data.twitter_title || data.title || 'Untitled';
        const description = data.twitter_description || data.description || '';
        const image = data.twitter_image || data.og_image || '';
        const site = data.twitter_site || '';
        
        const truncatedTitle = this.truncate(title, 70);
        const truncatedDesc = this.truncate(description, 200);
        
        const isLargeCard = cardType === 'summary_large_image';
        
        return `
            <div class="preview-twitter" style="
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                max-width: ${isLargeCard ? '500px' : '350px'};
                border: 1px solid rgb(207, 217, 222);
                border-radius: 16px;
                overflow: hidden;
                background: white;
            ">
                ${image ? `
                    <div style="
                        width: 100%;
                        height: ${isLargeCard ? '280px' : '175px'};
                        background: #f7f9fa;
                        background-image: url('${this.escapeHtml(image)}');
                        background-size: cover;
                        background-position: center;
                    "></div>
                ` : `
                    <div style="
                        width: 100%;
                        height: ${isLargeCard ? '280px' : '175px'};
                        background: linear-gradient(135deg, #1da1f2 0%, #0d8bd9 100%);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 48px;
                    ">
                        <i class="fab fa-twitter"></i>
                    </div>
                `}
                <div style="padding: 12px;">
                    <div style="
                        font-size: 15px;
                        font-weight: 700;
                        color: rgb(15, 20, 25);
                        margin-bottom: 2px;
                        line-height: 20px;
                    ">
                        ${this.escapeHtml(truncatedTitle)}
                    </div>
                    ${description ? `
                        <div style="
                            font-size: 15px;
                            color: rgb(83, 100, 113);
                            line-height: 20px;
                            margin-bottom: 2px;
                        ">
                            ${this.escapeHtml(truncatedDesc)}
                        </div>
                    ` : ''}
                    ${site ? `
                        <div style="
                            font-size: 15px;
                            color: rgb(83, 100, 113);
                            line-height: 20px;
                        ">
                            ${this.escapeHtml(site)}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    /**
     * Generate LinkedIn preview
     */
    generateLinkedInPreview(data) {
        const title = data.og_title || data.title || 'Untitled';
        const description = data.og_description || data.description || '';
        const image = data.og_image || '';
        const url = data.og_url || data.canonical || '';
        
        let domain = '';
        try {
            domain = new URL(url).hostname;
        } catch (e) {
            domain = 'example.com';
        }
        
        const truncatedTitle = this.truncate(title, 100);
        const truncatedDesc = this.truncate(description, 150);
        
        return `
            <div class="preview-linkedin" style="
                font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                max-width: 552px;
                border: 1px solid rgba(0,0,0,0.15);
                border-radius: 2px;
                overflow: hidden;
                background: white;
            ">
                ${image ? `
                    <div style="
                        width: 100%;
                        height: 289px;
                        background: #f3f6f8;
                        background-image: url('${this.escapeHtml(image)}');
                        background-size: cover;
                        background-position: center;
                    "></div>
                ` : `
                    <div style="
                        width: 100%;
                        height: 289px;
                        background: linear-gradient(135deg, #0077b5 0%, #005885 100%);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 64px;
                    ">
                        <i class="fab fa-linkedin"></i>
                    </div>
                `}
                <div style="padding: 12px 12px 16px;">
                    <div style="
                        font-size: 14px;
                        font-weight: 600;
                        color: rgba(0,0,0,0.9);
                        margin-bottom: 4px;
                        line-height: 1.33333;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    ">
                        ${this.escapeHtml(truncatedTitle)}
                    </div>
                    ${description ? `
                        <div style="
                            font-size: 12px;
                            color: rgba(0,0,0,0.6);
                            line-height: 1.33333;
                            margin-bottom: 8px;
                        ">
                            ${this.escapeHtml(truncatedDesc)}
                        </div>
                    ` : ''}
                    <div style="
                        font-size: 12px;
                        color: rgba(0,0,0,0.6);
                    ">
                        ${this.escapeHtml(domain)}
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Truncate text
     */
    truncate(text, maxLength) {
        if (!text) return '';
        
        if (text.length <= maxLength) {
            return text;
        }
        
        return text.substring(0, maxLength - 3) + '...';
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
     * Get all available preview types
     */
    getAvailableTypes() {
        return Object.keys(this.previewGenerators);
    }
    
    /**
     * Validate preview data
     */
    validatePreviewData(data, type) {
        const warnings = [];
        
        switch (type) {
            case 'google':
                if (!data.title) warnings.push('Missing title');
                if (!data.description) warnings.push('Missing description');
                break;
                
            case 'facebook':
                if (!data.og_title && !data.title) warnings.push('Missing OG title');
                if (!data.og_image) warnings.push('Missing OG image');
                break;
                
            case 'twitter':
                if (!data.twitter_card) warnings.push('Missing Twitter card type');
                if (!data.twitter_title && !data.title) warnings.push('Missing Twitter title');
                break;
                
            case 'linkedin':
                if (!data.og_title && !data.title) warnings.push('Missing title');
                if (!data.og_image) warnings.push('Missing image');
                break;
        }
        
        return {
            valid: warnings.length === 0,
            warnings
        };
    }
}