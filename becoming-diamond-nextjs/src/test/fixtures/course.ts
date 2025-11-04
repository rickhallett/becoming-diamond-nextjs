import type { CourseChapter, CourseSlide, VideoReference } from '@/types/course';

export const mockVideoReference: VideoReference = {
  videoId: 'test-video-123',
  autoplay: false,
  poster: '/images/poster.jpg',
  quality: '1080p',
};

export const mockSlide: CourseSlide = {
  id: 'pr1-c0-s0-intro',
  title: 'Introduction',
  content: '<p>Test slide content</p>',
  order: 0,
  videoReferences: [mockVideoReference],
  mediaType: 'video',
  estimatedTime: 5,
};

export const mockSlide2: CourseSlide = {
  id: 'pr1-c0-s1-lesson',
  title: 'First Lesson',
  content: '<p>Lesson content</p>',
  order: 1,
  videoReferences: [],
  estimatedTime: 10,
};

export const mockChapter: CourseChapter = {
  id: 'pr1-c0',
  title: 'Chapter 1',
  order: 0,
  slides: [mockSlide, mockSlide2],
  part: 1,
};

export const mockChapter2: CourseChapter = {
  id: 'pr1-c1',
  title: 'Chapter 2',
  order: 1,
  slides: [
    {
      id: 'pr1-c1-s0-intro',
      title: 'Chapter 2 Intro',
      content: '<p>Chapter 2 content</p>',
      order: 0,
      videoReferences: [],
      estimatedTime: 8,
    },
  ],
  part: 1,
};

export const mockCourse = {
  id: 'pr1-test-course',
  title: 'Test Course',
  chapters: [mockChapter, mockChapter2],
  totalChapters: 2,
  totalSlides: 3,
  metadata: {
    id: 'pr1-test-course',
    title: 'Test Course',
    pressureRoom: 1,
    duration: '4 weeks',
    difficulty: 'Beginner' as const,
    instructor: 'Test Instructor',
    thumbnail: '/courses/test-thumbnail.jpg',
    published: true,
  },
};
