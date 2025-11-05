import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-4">Course Not Found</h1>
      <p className="text-gray-400 mb-8">The course you&apos;re looking for doesn&apos;t exist.</p>
      <Link
        href="/app/courses"
        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition"
      >
        Back to Courses
      </Link>
    </div>
  );
}
