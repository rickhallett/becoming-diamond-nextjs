import { getCourseContent, getAllCourses } from "@/lib/content";
import { notFound } from "next/navigation";
import CourseViewer from "./CourseViewer";

interface PageProps {
  params: Promise<{
    courseId: string;
  }>;
}

// Generate static params for all courses
export async function generateStaticParams() {
  const courses = await getAllCourses();
  return courses.map((course) => ({
    courseId: course.id,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { courseId } = await params;
  const course = await getCourseContent(courseId);

  if (!course) {
    return {
      title: "Course Not Found | Becoming Diamond",
    };
  }

  return {
    title: `${course.title} | Becoming Diamond`,
    description: course.metadata.description || `Learn ${course.title} with Becoming Diamond`,
  };
}

export default async function CoursePage({ params }: PageProps) {
  const { courseId } = await params;
  const course = await getCourseContent(courseId);

  if (!course) {
    notFound();
  }

  return <CourseViewer course={course} />;
}
