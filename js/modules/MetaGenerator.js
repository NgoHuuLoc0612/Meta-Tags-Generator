/**
 * META GENERATOR MODULE
 * Generates comprehensive meta tags for SEO and social media
 */

export class MetaGenerator {
    constructor() {
        this.generators = {
            basic: this.generateBasicMeta.bind(this),
            seo: this.generateSEOMeta.bind(this),
            opengraph: this.generateOpenGraphMeta.bind(this),
            twitter: this.generateTwitterMeta.bind(this),
            schema: this.generateSchemaOrg.bind(this),
            advanced: this.generateAdvancedMeta.bind(this),
            mobile: this.generateMobileMeta.bind(this),
            social: this.generateSocialMeta.bind(this)
        };
    }
    
    /**
     * Generate all meta tags
     */
    generate(formData) {
        const tags = [];
        
        // Generate tags for each category
        for (const [category, generator] of Object.entries(this.generators)) {
            const categoryTags = generator(formData);
            tags.push(...categoryTags);
        }
        
        // Format and return
        return this.formatTags(tags);
    }
    
    /**
     * Generate Basic Meta Tags
     */
    generateBasicMeta(data) {
        const tags = [];
        
        if (data.title) {
            tags.push({ tag: 'title', content: data.title });
        }
        
        if (data.description) {
            tags.push({ 
                tag: 'meta', 
                name: 'description', 
                content: data.description 
            });
        }
        
        if (data.keywords) {
            tags.push({ 
                tag: 'meta', 
                name: 'keywords', 
                content: data.keywords 
            });
        }
        
        if (data.author) {
            tags.push({ 
                tag: 'meta', 
                name: 'author', 
                content: data.author 
            });
        }
        
        if (data.viewport) {
            tags.push({ 
                tag: 'meta', 
                name: 'viewport', 
                content: data.viewport 
            });
        }
        
        if (data.charset) {
            tags.push({ 
                tag: 'meta', 
                charset: data.charset 
            });
        }
        
        return tags;
    }
    
    /**
     * Generate SEO Meta Tags
     */
    generateSEOMeta(data) {
        const tags = [];
        
        if (data.canonical) {
            tags.push({ 
                tag: 'link', 
                rel: 'canonical', 
                href: data.canonical 
            });
        }
        
        if (data.robots) {
            tags.push({ 
                tag: 'meta', 
                name: 'robots', 
                content: data.robots 
            });
        }
        
        if (data.googlebot) {
            tags.push({ 
                tag: 'meta', 
                name: 'googlebot', 
                content: data.googlebot 
            });
        }
        
        if (data.language) {
            tags.push({ 
                tag: 'meta', 
                httpEquiv: 'content-language', 
                content: data.language 
            });
        }
        
        if (data.geo_region) {
            tags.push({ 
                tag: 'meta', 
                name: 'geo.region', 
                content: data.geo_region 
            });
        }
        
        if (data.geo_position) {
            tags.push({ 
                tag: 'meta', 
                name: 'geo.position', 
                content: data.geo_position 
            });
        }
        
        if (data.icbm) {
            tags.push({ 
                tag: 'meta', 
                name: 'ICBM', 
                content: data.icbm 
            });
        }
        
        return tags;
    }
    
    /**
     * Generate Open Graph Meta Tags
     */
    generateOpenGraphMeta(data) {
        const tags = [];
        
        const ogMapping = {
            og_title: 'og:title',
            og_description: 'og:description',
            og_type: 'og:type',
            og_url: 'og:url',
            og_image: 'og:image',
            og_image_width: 'og:image:width',
            og_image_height: 'og:image:height',
            og_image_alt: 'og:image:alt',
            og_site_name: 'og:site_name',
            og_locale: 'og:locale',
            og_video: 'og:video',
            og_audio: 'og:audio',
            fb_app_id: 'fb:app_id'
        };
        
        for (const [key, property] of Object.entries(ogMapping)) {
            if (data[key]) {
                tags.push({ 
                    tag: 'meta', 
                    property, 
                    content: data[key] 
                });
            }
        }
        
        // Article specific
        if (data.og_type === 'article') {
            if (data.article_published_time) {
                tags.push({ 
                    tag: 'meta', 
                    property: 'article:published_time', 
                    content: data.article_published_time 
                });
            }
            
            if (data.article_modified_time) {
                tags.push({ 
                    tag: 'meta', 
                    property: 'article:modified_time', 
                    content: data.article_modified_time 
                });
            }
            
            if (data.article_author) {
                tags.push({ 
                    tag: 'meta', 
                    property: 'article:author', 
                    content: data.article_author 
                });
            }
            
            if (data.article_section) {
                tags.push({ 
                    tag: 'meta', 
                    property: 'article:section', 
                    content: data.article_section 
                });
            }
            
            if (data.article_tag) {
                tags.push({ 
                    tag: 'meta', 
                    property: 'article:tag', 
                    content: data.article_tag 
                });
            }
        }
        
        return tags;
    }
    
    /**
     * Generate Twitter Card Meta Tags
     */
    generateTwitterMeta(data) {
        const tags = [];
        
        const twitterMapping = {
            twitter_card: 'twitter:card',
            twitter_site: 'twitter:site',
            twitter_creator: 'twitter:creator',
            twitter_title: 'twitter:title',
            twitter_description: 'twitter:description',
            twitter_image: 'twitter:image',
            twitter_image_alt: 'twitter:image:alt',
            twitter_player: 'twitter:player',
            twitter_player_width: 'twitter:player:width',
            twitter_player_height: 'twitter:player:height'
        };
        
        for (const [key, name] of Object.entries(twitterMapping)) {
            if (data[key]) {
                tags.push({ 
                    tag: 'meta', 
                    name, 
                    content: data[key] 
                });
            }
        }
        
        return tags;
    }
    
    /**
     * Generate Schema.org Structured Data
     */
    generateSchemaOrg(data) {
        const tags = [];
        
        if (data.schema_type) {
            const schema = {
                '@context': 'https://schema.org',
                '@type': data.schema_type
            };
            
            // Add schema properties based on type
            if (data.schema_name) schema.name = data.schema_name;
            if (data.schema_description) schema.description = data.schema_description;
            if (data.schema_url) schema.url = data.schema_url;
            if (data.schema_image) schema.image = data.schema_image;
            
            // Organization specific
            if (data.schema_type === 'Organization') {
                if (data.schema_logo) schema.logo = data.schema_logo;
                if (data.schema_contact_type) {
                    schema.contactPoint = {
                        '@type': 'ContactPoint',
                        telephone: data.schema_telephone,
                        contactType: data.schema_contact_type
                    };
                }
            }
            
            // Person specific
            if (data.schema_type === 'Person') {
                if (data.schema_job_title) schema.jobTitle = data.schema_job_title;
                if (data.schema_works_for) schema.worksFor = data.schema_works_for;
            }
            
            // Article specific
            if (data.schema_type === 'Article') {
                if (data.schema_headline) schema.headline = data.schema_headline;
                if (data.schema_date_published) schema.datePublished = data.schema_date_published;
                if (data.schema_date_modified) schema.dateModified = data.schema_date_modified;
                if (data.schema_author_name) {
                    schema.author = {
                        '@type': 'Person',
                        name: data.schema_author_name
                    };
                }
            }
            
            tags.push({ 
                tag: 'script', 
                type: 'application/ld+json', 
                content: JSON.stringify(schema, null, 2) 
            });
        }
        
        return tags;
    }
    
    /**
     * Generate Advanced Meta Tags
     */
    generateAdvancedMeta(data) {
        const tags = [];
        
        if (data.theme_color) {
            tags.push({ 
                tag: 'meta', 
                name: 'theme-color', 
                content: data.theme_color 
            });
        }
        
        if (data.msapplication_tilecolor) {
            tags.push({ 
                tag: 'meta', 
                name: 'msapplication-TileColor', 
                content: data.msapplication_tilecolor 
            });
        }
        
        if (data.msapplication_config) {
            tags.push({ 
                tag: 'meta', 
                name: 'msapplication-config', 
                content: data.msapplication_config 
            });
        }
        
        if (data.rating) {
            tags.push({ 
                tag: 'meta', 
                name: 'rating', 
                content: data.rating 
            });
        }
        
        if (data.referrer) {
            tags.push({ 
                tag: 'meta', 
                name: 'referrer', 
                content: data.referrer 
            });
        }
        
        return tags;
    }
    
    /**
     * Generate Mobile/PWA Meta Tags
     */
    generateMobileMeta(data) {
        const tags = [];
        
        if (data.mobile_web_app_capable) {
            tags.push({ 
                tag: 'meta', 
                name: 'mobile-web-app-capable', 
                content: 'yes' 
            });
        }
        
        if (data.apple_mobile_web_app_capable) {
            tags.push({ 
                tag: 'meta', 
                name: 'apple-mobile-web-app-capable', 
                content: 'yes' 
            });
        }
        
        if (data.apple_mobile_web_app_status_bar_style) {
            tags.push({ 
                tag: 'meta', 
                name: 'apple-mobile-web-app-status-bar-style', 
                content: data.apple_mobile_web_app_status_bar_style 
            });
        }
        
        if (data.apple_mobile_web_app_title) {
            tags.push({ 
                tag: 'meta', 
                name: 'apple-mobile-web-app-title', 
                content: data.apple_mobile_web_app_title 
            });
        }
        
        if (data.apple_touch_icon) {
            tags.push({ 
                tag: 'link', 
                rel: 'apple-touch-icon', 
                href: data.apple_touch_icon 
            });
        }
        
        if (data.manifest) {
            tags.push({ 
                tag: 'link', 
                rel: 'manifest', 
                href: data.manifest 
            });
        }
        
        return tags;
    }
    
    /**
     * Generate Social Media Meta Tags
     */
    generateSocialMeta(data) {
        const tags = [];
        
        if (data.pinterest_rich_pin) {
            tags.push({ 
                tag: 'meta', 
                name: 'pinterest-rich-pin', 
                content: 'true' 
            });
        }
        
        if (data.linkedin_owner) {
            tags.push({ 
                tag: 'meta', 
                property: 'linkedin:owner', 
                content: data.linkedin_owner 
            });
        }
        
        return tags;
    }
    
    /**
     * Format tags to HTML
     */
    formatTags(tags) {
        const lines = [];
        
        for (const tag of tags) {
            if (tag.tag === 'title') {
                lines.push(`    <title>${this.escapeHtml(tag.content)}</title>`);
            } else if (tag.tag === 'meta') {
                const attrs = [];
                
                if (tag.charset) {
                    attrs.push(`charset="${tag.charset}"`);
                }
                if (tag.name) {
                    attrs.push(`name="${tag.name}"`);
                }
                if (tag.property) {
                    attrs.push(`property="${tag.property}"`);
                }
                if (tag.httpEquiv) {
                    attrs.push(`http-equiv="${tag.httpEquiv}"`);
                }
                if (tag.content) {
                    attrs.push(`content="${this.escapeHtml(tag.content)}"`);
                }
                
                lines.push(`    <meta ${attrs.join(' ')}>`);
            } else if (tag.tag === 'link') {
                const attrs = [];
                
                if (tag.rel) attrs.push(`rel="${tag.rel}"`);
                if (tag.href) attrs.push(`href="${tag.href}"`);
                if (tag.type) attrs.push(`type="${tag.type}"`);
                
                lines.push(`    <link ${attrs.join(' ')}>`);
            } else if (tag.tag === 'script') {
                lines.push(`    <script type="${tag.type}">`);
                lines.push(tag.content);
                lines.push(`    </script>`);
            }
        }
        
        return lines.join('\n');
    }
    
    /**
     * Escape HTML special characters
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Get statistics
     */
    getStats(data) {
        const tags = [];
        
        for (const generator of Object.values(this.generators)) {
            tags.push(...generator(data));
        }
        
        const seoScore = this.calculateSEOScore(data);
        const charCount = this.formatTags(tags).length;
        
        return {
            totalTags: tags.length,
            seoScore,
            charCount
        };
    }
    
    /**
     * Calculate SEO Score
     */
    calculateSEOScore(data) {
        let score = 0;
        const maxScore = 100;
        
        // Basic meta (30 points)
        if (data.title) score += 10;
        if (data.description && data.description.length >= 120) score += 10;
        if (data.keywords) score += 10;
        
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
        
        return Math.min(score, maxScore);
    }
}