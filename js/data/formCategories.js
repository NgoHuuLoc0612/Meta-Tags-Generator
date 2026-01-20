/**
 * FORM CATEGORIES DATA
 * Comprehensive form field definitions for all meta tag categories
 */

export const formCategories = {
    basic: {
        title: 'Basic Meta Information',
        description: 'Essential meta tags for your website',
        icon: 'fa-info-circle',
        fields: [
            {
                name: 'title',
                label: 'Page Title',
                type: 'text',
                placeholder: 'Enter page title (50-60 characters recommended)',
                required: true,
                maxLength: 60,
                help: 'The title that appears in browser tabs and search results'
            },
            {
                name: 'description',
                label: 'Meta Description',
                type: 'textarea',
                placeholder: 'Enter meta description (120-160 characters recommended)',
                required: true,
                maxLength: 160,
                help: 'Brief description shown in search engine results'
            },
            {
                name: 'keywords',
                label: 'Keywords',
                type: 'text',
                placeholder: 'keyword1, keyword2, keyword3',
                help: 'Comma-separated keywords (less important for modern SEO)'
            },
            {
                name: 'author',
                label: 'Author',
                type: 'text',
                placeholder: 'Author name',
                help: 'Name of the page author or website owner'
            },
            {
                name: 'viewport',
                label: 'Viewport',
                type: 'text',
                placeholder: 'width=device-width, initial-scale=1.0',
                value: 'width=device-width, initial-scale=1.0',
                help: 'Controls page dimensions and scaling on mobile devices'
            },
            {
                name: 'charset',
                label: 'Character Encoding',
                type: 'select',
                options: [
                    { value: 'UTF-8', label: 'UTF-8 (Recommended)' },
                    { value: 'ISO-8859-1', label: 'ISO-8859-1' },
                    { value: 'Windows-1252', label: 'Windows-1252' }
                ],
                value: 'UTF-8',
                help: 'Character encoding for the HTML document'
            }
        ]
    },
    
    seo: {
        title: 'SEO Meta Tags',
        description: 'Search engine optimization meta tags',
        icon: 'fa-search',
        fields: [
            {
                name: 'canonical',
                label: 'Canonical URL',
                type: 'url',
                placeholder: 'https://example.com/page',
                help: 'Preferred URL for duplicate content pages'
            },
            {
                name: 'robots',
                label: 'Robots Meta Tag',
                type: 'select',
                options: [
                    { value: 'index, follow', label: 'Index, Follow (Default)' },
                    { value: 'noindex, follow', label: 'No Index, Follow' },
                    { value: 'index, nofollow', label: 'Index, No Follow' },
                    { value: 'noindex, nofollow', label: 'No Index, No Follow' },
                    { value: 'noarchive', label: 'No Archive' },
                    { value: 'nosnippet', label: 'No Snippet' }
                ],
                value: 'index, follow',
                help: 'Instructions for search engine crawlers'
            },
            {
                name: 'googlebot',
                label: 'Googlebot',
                type: 'select',
                options: [
                    { value: 'index, follow', label: 'Index, Follow' },
                    { value: 'noindex, follow', label: 'No Index, Follow' },
                    { value: 'index, nofollow', label: 'Index, No Follow' },
                    { value: 'noindex, nofollow', label: 'No Index, No Follow' }
                ],
                help: 'Specific instructions for Google crawler'
            },
            {
                name: 'language',
                label: 'Content Language',
                type: 'text',
                placeholder: 'en-US',
                help: 'Primary language of the content (e.g., en-US, vi-VN)'
            },
            {
                name: 'geo_region',
                label: 'Geographic Region',
                type: 'text',
                placeholder: 'US-CA',
                help: 'Geographic region code (e.g., US-CA for California)'
            },
            {
                name: 'geo_position',
                label: 'Geographic Position',
                type: 'text',
                placeholder: '37.7749;-122.4194',
                help: 'Latitude and longitude separated by semicolon'
            },
            {
                name: 'icbm',
                label: 'ICBM Coordinates',
                type: 'text',
                placeholder: '37.7749, -122.4194',
                help: 'Alternative geographic coordinates format'
            }
        ]
    },
    
    opengraph: {
        title: 'Open Graph Meta Tags',
        description: 'Facebook and social media sharing meta tags',
        icon: 'fa-facebook',
        fields: [
            {
                name: 'og_title',
                label: 'OG Title',
                type: 'text',
                placeholder: 'Title for social sharing',
                required: true,
                help: 'Title shown when shared on Facebook, LinkedIn, etc.'
            },
            {
                name: 'og_description',
                label: 'OG Description',
                type: 'textarea',
                placeholder: 'Description for social sharing',
                help: 'Description shown in social media previews'
            },
            {
                name: 'og_type',
                label: 'OG Type',
                type: 'select',
                options: [
                    { value: 'website', label: 'Website' },
                    { value: 'article', label: 'Article' },
                    { value: 'blog', label: 'Blog' },
                    { value: 'book', label: 'Book' },
                    { value: 'profile', label: 'Profile' },
                    { value: 'video.movie', label: 'Video - Movie' },
                    { value: 'video.episode', label: 'Video - Episode' },
                    { value: 'video.tv_show', label: 'Video - TV Show' },
                    { value: 'video.other', label: 'Video - Other' },
                    { value: 'music.song', label: 'Music - Song' },
                    { value: 'music.album', label: 'Music - Album' }
                ],
                value: 'website',
                help: 'Type of content being shared'
            },
            {
                name: 'og_url',
                label: 'OG URL',
                type: 'url',
                placeholder: 'https://example.com',
                help: 'Canonical URL for the content'
            },
            {
                name: 'og_image',
                label: 'OG Image',
                type: 'url',
                placeholder: 'https://example.com/image.jpg',
                help: 'Image URL (1200x630px recommended)'
            },
            {
                name: 'og_image_width',
                label: 'OG Image Width',
                type: 'number',
                placeholder: '1200',
                help: 'Image width in pixels'
            },
            {
                name: 'og_image_height',
                label: 'OG Image Height',
                type: 'number',
                placeholder: '630',
                help: 'Image height in pixels'
            },
            {
                name: 'og_image_alt',
                label: 'OG Image Alt Text',
                type: 'text',
                placeholder: 'Description of the image',
                help: 'Accessibility text for the image'
            },
            {
                name: 'og_site_name',
                label: 'OG Site Name',
                type: 'text',
                placeholder: 'Your Site Name',
                help: 'Name of your website'
            },
            {
                name: 'og_locale',
                label: 'OG Locale',
                type: 'text',
                placeholder: 'en_US',
                value: 'en_US',
                help: 'Locale of the content (e.g., en_US, vi_VN)'
            },
            {
                name: 'og_video',
                label: 'OG Video',
                type: 'url',
                placeholder: 'https://example.com/video.mp4',
                help: 'URL to a video file'
            },
            {
                name: 'og_audio',
                label: 'OG Audio',
                type: 'url',
                placeholder: 'https://example.com/audio.mp3',
                help: 'URL to an audio file'
            },
            {
                name: 'fb_app_id',
                label: 'Facebook App ID',
                type: 'text',
                placeholder: '123456789',
                help: 'Facebook App ID for Facebook Insights'
            },
            {
                name: 'article_published_time',
                label: 'Article Published Time',
                type: 'datetime-local',
                condition: { field: 'og_type', value: 'article' },
                help: 'When the article was first published'
            },
            {
                name: 'article_modified_time',
                label: 'Article Modified Time',
                type: 'datetime-local',
                condition: { field: 'og_type', value: 'article' },
                help: 'When the article was last modified'
            },
            {
                name: 'article_author',
                label: 'Article Author',
                type: 'url',
                condition: { field: 'og_type', value: 'article' },
                placeholder: 'https://facebook.com/author',
                help: 'Facebook profile URL of the author'
            },
            {
                name: 'article_section',
                label: 'Article Section',
                type: 'text',
                condition: { field: 'og_type', value: 'article' },
                placeholder: 'Technology',
                help: 'Category or section of the article'
            },
            {
                name: 'article_tag',
                label: 'Article Tags',
                type: 'text',
                condition: { field: 'og_type', value: 'article' },
                placeholder: 'tag1, tag2, tag3',
                help: 'Comma-separated tags for the article'
            }
        ]
    },
    
    twitter: {
        title: 'Twitter Card Meta Tags',
        description: 'Twitter-specific meta tags for card previews',
        icon: 'fa-twitter',
        fields: [
            {
                name: 'twitter_card',
                label: 'Twitter Card Type',
                type: 'select',
                options: [
                    { value: 'summary', label: 'Summary Card' },
                    { value: 'summary_large_image', label: 'Summary with Large Image' },
                    { value: 'app', label: 'App Card' },
                    { value: 'player', label: 'Player Card' }
                ],
                value: 'summary_large_image',
                help: 'Type of Twitter Card to display'
            },
            {
                name: 'twitter_site',
                label: 'Twitter Site',
                type: 'text',
                placeholder: '@username',
                help: 'Twitter @username of website'
            },
            {
                name: 'twitter_creator',
                label: 'Twitter Creator',
                type: 'text',
                placeholder: '@username',
                help: 'Twitter @username of content creator'
            },
            {
                name: 'twitter_title',
                label: 'Twitter Title',
                type: 'text',
                placeholder: 'Title for Twitter card',
                help: 'Title for Twitter card (max 70 characters)'
            },
            {
                name: 'twitter_description',
                label: 'Twitter Description',
                type: 'textarea',
                placeholder: 'Description for Twitter card',
                help: 'Description for Twitter card (max 200 characters)'
            },
            {
                name: 'twitter_image',
                label: 'Twitter Image',
                type: 'url',
                placeholder: 'https://example.com/image.jpg',
                help: 'Image URL (min 300x157px, max 4096x4096px)'
            },
            {
                name: 'twitter_image_alt',
                label: 'Twitter Image Alt',
                type: 'text',
                placeholder: 'Description of image',
                help: 'Alt text for the image (max 420 characters)'
            },
            {
                name: 'twitter_player',
                label: 'Twitter Player URL',
                type: 'url',
                placeholder: 'https://example.com/player',
                help: 'URL to iframe player (for player card)'
            },
            {
                name: 'twitter_player_width',
                label: 'Player Width',
                type: 'number',
                placeholder: '480',
                help: 'Width of player iframe in pixels'
            },
            {
                name: 'twitter_player_height',
                label: 'Player Height',
                type: 'number',
                placeholder: '270',
                help: 'Height of player iframe in pixels'
            }
        ]
    },
    
    schema: {
        title: 'Schema.org Structured Data',
        description: 'JSON-LD structured data for rich search results',
        icon: 'fa-code',
        fields: [
            {
                name: 'schema_type',
                label: 'Schema Type',
                type: 'select',
                options: [
                    { value: '', label: 'Select Type...' },
                    { value: 'Article', label: 'Article' },
                    { value: 'BlogPosting', label: 'Blog Posting' },
                    { value: 'NewsArticle', label: 'News Article' },
                    { value: 'Organization', label: 'Organization' },
                    { value: 'Person', label: 'Person' },
                    { value: 'Product', label: 'Product' },
                    { value: 'Event', label: 'Event' },
                    { value: 'Recipe', label: 'Recipe' },
                    { value: 'WebSite', label: 'WebSite' },
                    { value: 'LocalBusiness', label: 'Local Business' }
                ],
                help: 'Type of structured data to implement'
            },
            {
                name: 'schema_name',
                label: 'Name',
                type: 'text',
                placeholder: 'Name of the entity',
                help: 'Name of the organization, person, or product'
            },
            {
                name: 'schema_description',
                label: 'Description',
                type: 'textarea',
                placeholder: 'Description of the entity',
                help: 'Detailed description'
            },
            {
                name: 'schema_url',
                label: 'URL',
                type: 'url',
                placeholder: 'https://example.com',
                help: 'URL of the entity'
            },
            {
                name: 'schema_image',
                label: 'Image URL',
                type: 'url',
                placeholder: 'https://example.com/image.jpg',
                help: 'Representative image'
            },
            {
                name: 'schema_logo',
                label: 'Logo URL',
                type: 'url',
                placeholder: 'https://example.com/logo.png',
                condition: { field: 'schema_type', value: 'Organization' },
                help: 'Organization logo'
            },
            {
                name: 'schema_telephone',
                label: 'Telephone',
                type: 'tel',
                placeholder: '+1-555-555-5555',
                condition: { field: 'schema_type', value: 'Organization' },
                help: 'Contact telephone number'
            },
            {
                name: 'schema_contact_type',
                label: 'Contact Type',
                type: 'select',
                options: [
                    { value: 'customer service', label: 'Customer Service' },
                    { value: 'technical support', label: 'Technical Support' },
                    { value: 'billing support', label: 'Billing Support' },
                    { value: 'sales', label: 'Sales' }
                ],
                condition: { field: 'schema_type', value: 'Organization' },
                help: 'Type of contact point'
            },
            {
                name: 'schema_headline',
                label: 'Headline',
                type: 'text',
                placeholder: 'Article headline',
                condition: { field: 'schema_type', value: 'Article' },
                help: 'Headline of the article'
            },
            {
                name: 'schema_date_published',
                label: 'Date Published',
                type: 'datetime-local',
                condition: { field: 'schema_type', value: 'Article' },
                help: 'Publication date'
            },
            {
                name: 'schema_date_modified',
                label: 'Date Modified',
                type: 'datetime-local',
                condition: { field: 'schema_type', value: 'Article' },
                help: 'Last modification date'
            },
            {
                name: 'schema_author_name',
                label: 'Author Name',
                type: 'text',
                placeholder: 'Author name',
                condition: { field: 'schema_type', value: 'Article' },
                help: 'Name of the author'
            },
            {
                name: 'schema_job_title',
                label: 'Job Title',
                type: 'text',
                placeholder: 'Software Engineer',
                condition: { field: 'schema_type', value: 'Person' },
                help: 'Person\'s job title'
            },
            {
                name: 'schema_works_for',
                label: 'Works For',
                type: 'text',
                placeholder: 'Company name',
                condition: { field: 'schema_type', value: 'Person' },
                help: 'Organization the person works for'
            }
        ]
    },
    
    advanced: {
        title: 'Advanced Meta Tags',
        description: 'Additional meta tags for specific use cases',
        icon: 'fa-cogs',
        fields: [
            {
                name: 'theme_color',
                label: 'Theme Color',
                type: 'color',
                value: '#2563eb',
                help: 'Browser theme color for mobile devices'
            },
            {
                name: 'msapplication_tilecolor',
                label: 'MS Tile Color',
                type: 'color',
                value: '#2563eb',
                help: 'Windows tile background color'
            },
            {
                name: 'msapplication_config',
                label: 'MS Application Config',
                type: 'url',
                placeholder: '/browserconfig.xml',
                help: 'Path to browserconfig.xml for Windows tiles'
            },
            {
                name: 'rating',
                label: 'Content Rating',
                type: 'select',
                options: [
                    { value: 'general', label: 'General' },
                    { value: 'mature', label: 'Mature' },
                    { value: 'restricted', label: 'Restricted' },
                    { value: '14 years', label: '14 Years' },
                    { value: 'safe for kids', label: 'Safe for Kids' }
                ],
                help: 'Content rating for parental control'
            },
            {
                name: 'referrer',
                label: 'Referrer Policy',
                type: 'select',
                options: [
                    { value: 'no-referrer', label: 'No Referrer' },
                    { value: 'no-referrer-when-downgrade', label: 'No Referrer When Downgrade' },
                    { value: 'origin', label: 'Origin' },
                    { value: 'origin-when-cross-origin', label: 'Origin When Cross-Origin' },
                    { value: 'same-origin', label: 'Same Origin' },
                    { value: 'strict-origin', label: 'Strict Origin' },
                    { value: 'strict-origin-when-cross-origin', label: 'Strict Origin When Cross-Origin' },
                    { value: 'unsafe-url', label: 'Unsafe URL' }
                ],
                help: 'Controls how much referrer information is sent'
            }
        ]
    },
    
    mobile: {
        title: 'Mobile & PWA Meta Tags',
        description: 'Meta tags for mobile devices and Progressive Web Apps',
        icon: 'fa-mobile-alt',
        fields: [
            {
                name: 'mobile_web_app_capable',
                label: 'Mobile Web App Capable',
                type: 'checkbox',
                help: 'Enable fullscreen mode on mobile devices'
            },
            {
                name: 'apple_mobile_web_app_capable',
                label: 'Apple Mobile Web App Capable',
                type: 'checkbox',
                help: 'Enable standalone mode on iOS'
            },
            {
                name: 'apple_mobile_web_app_status_bar_style',
                label: 'Apple Status Bar Style',
                type: 'select',
                options: [
                    { value: 'default', label: 'Default' },
                    { value: 'black', label: 'Black' },
                    { value: 'black-translucent', label: 'Black Translucent' }
                ],
                help: 'iOS status bar appearance'
            },
            {
                name: 'apple_mobile_web_app_title',
                label: 'Apple Web App Title',
                type: 'text',
                placeholder: 'App Name',
                help: 'Title when added to iOS home screen'
            },
            {
                name: 'apple_touch_icon',
                label: 'Apple Touch Icon',
                type: 'url',
                placeholder: '/apple-touch-icon.png',
                help: 'Icon for iOS home screen (180x180px)'
            },
            {
                name: 'manifest',
                label: 'Web App Manifest',
                type: 'url',
                placeholder: '/manifest.json',
                help: 'Path to web app manifest file'
            }
        ]
    },
    
    social: {
        title: 'Other Social Media',
        description: 'Meta tags for Pinterest, LinkedIn and other platforms',
        icon: 'fa-share-alt',
        fields: [
            {
                name: 'pinterest_rich_pin',
                label: 'Pinterest Rich Pin',
                type: 'checkbox',
                help: 'Enable Pinterest Rich Pins'
            },
            {
                name: 'linkedin_owner',
                label: 'LinkedIn Page Owner',
                type: 'text',
                placeholder: 'company-id',
                help: 'LinkedIn company page ID'
            }
        ]
    }
};