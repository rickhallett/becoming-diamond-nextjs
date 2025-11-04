export const mockSprintDay = {
  slug: 'day-01',
  frontmatter: {
    title: 'Day 1: Introduction',
    day: 1,
    published: true,
    description: 'Welcome to the journey',
  },
  content: '<h1>Day 1</h1><p>Welcome to the Becoming Diamond journey.</p>',
};

export const mockCourse = {
  metadata: {
    id: 'pr1-stabilize-snowflakes-to-diamonds',
    title: 'Pressure Room 1: Stabilize',
    pressureRoom: 1,
    published: true,
    description: 'Learn to stabilize under pressure',
  },
  chapters: [
    {
      title: 'Introduction',
      slides: [
        {
          title: 'Welcome',
          content: '<p>Welcome to Pressure Room 1</p>',
          hasVideo: false,
        },
      ],
    },
  ],
};

export const mockNewsArticle = {
  slug: '2024-01-15-test-article',
  frontmatter: {
    title: 'Test Article',
    date: '2024-01-15',
    published: true,
    thumbnail: '/images/test.jpg',
    description: 'A test article',
  },
  content: '<h1>Test Article</h1><p>This is test content.</p>',
};
