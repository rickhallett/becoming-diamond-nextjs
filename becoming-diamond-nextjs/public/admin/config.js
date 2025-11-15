// Dynamic Decap CMS Configuration
// Automatically detects environment and sets correct base_url
// Note: CMS_MANUAL_INIT is set in index.html before this script loads

// Environment detection
const isProduction = window.location.hostname !== 'localhost' &&
                     window.location.hostname !== '127.0.0.1';

// Branch strategy:
// - Development (localhost): cms-staging (allows safe testing before merge)
// - Production (live domain): main (immediate publishing for content editors)
const targetBranch = isProduction ? 'main' : 'cms-staging';

console.log(`Decap CMS Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
console.log(`Target branch: ${targetBranch}`);

const config = {
  backend: {
    name: 'github',
    repo: 'rickhallett/becoming-diamond-nextjs',
    branch: targetBranch,
    base_url: window.location.origin,
    auth_endpoint: 'api/cms-auth'
  },

  // Media files will be stored in the repo under public/uploads
  media_folder: 'becoming-diamond-nextjs/public/uploads',
  public_folder: '/uploads',

  collections: [
    // Blog Posts Collection (displayed as "Insights" on website)
    {
      name: 'blog',
      label: 'Blog Posts',
      folder: 'becoming-diamond-nextjs/content/blog',
      create: true,
      slug: '{{year}}-{{month}}-{{day}}-{{slug}}',
      fields: [
        { label: 'Title', name: 'title', widget: 'string' },
        { label: 'Author', name: 'author', widget: 'string' },
        { label: 'Date', name: 'date', widget: 'datetime' },
        { label: 'Featured Image', name: 'thumbnail', widget: 'image', required: false },
        { label: 'Excerpt', name: 'excerpt', widget: 'text' },
        { label: 'Body', name: 'body', widget: 'markdown' },
        { label: 'Categories', name: 'categories', widget: 'list' },
        { label: 'Tags', name: 'tags', widget: 'list' },
        { label: 'Published', name: 'published', widget: 'boolean', default: true }
      ]
    },

    // 30 Day Sprint Collection
    {
      name: 'sprint',
      label: '30 Day Sprint',
      folder: 'becoming-diamond-nextjs/content/sprint',
      create: true,
      slug: 'day-{{day}}',
      identifier_field: 'day',
      fields: [
        {
          label: 'Day Number',
          name: 'day',
          widget: 'select',
          options: [
            '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
            '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
            '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'
          ]
        },
        { label: 'Title', name: 'title', widget: 'string' },
        { label: 'Subtitle', name: 'subtitle', widget: 'string' },
        { label: 'Published', name: 'published', widget: 'boolean', default: true },
        { label: 'Duration (e.g., "15 minutes")', name: 'duration', widget: 'string' },
        { label: 'Difficulty', name: 'difficulty', widget: 'select', options: ['Beginner', 'Intermediate', 'Advanced'] },
        { label: 'Video ID', name: 'video', widget: 'string', required: false },
        { label: 'Body', name: 'body', widget: 'markdown' }
      ]
    },

    // Site Settings
    {
      name: 'settings',
      label: 'Site Settings',
      files: [
        {
          label: 'General Settings',
          name: 'general',
          file: 'becoming-diamond-nextjs/content/settings/general.yml',
          fields: [
            { label: 'Site Title', name: 'title', widget: 'string' },
            { label: 'Site Description', name: 'description', widget: 'text' },
            { label: 'Site Keywords', name: 'keywords', widget: 'list' },
            { label: 'Site Logo', name: 'logo', widget: 'image', required: false },
            { label: 'Favicon', name: 'favicon', widget: 'image', required: false },
            {
              label: 'Social Media',
              name: 'social',
              widget: 'object',
              fields: [
                { label: 'Twitter', name: 'twitter', widget: 'string', required: false },
                { label: 'Facebook', name: 'facebook', widget: 'string', required: false },
                { label: 'Instagram', name: 'instagram', widget: 'string', required: false },
                { label: 'LinkedIn', name: 'linkedin', widget: 'string', required: false },
                { label: 'GitHub', name: 'github', widget: 'string', required: false }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// Initialize Decap CMS with dynamic config
console.log('Initializing Decap CMS with config:', config);
CMS.init({ config });
console.log('Decap CMS initialized - waiting for authentication...');
