"use client";
import { useState } from "react";
import { IconClock, IconUsers, IconStar, IconProgress, IconLock, IconCheck } from "@tabler/icons-react";
import { useUser } from "@/contexts/UserContext";
import { useCourses, SAMPLE_COURSES } from "@/contexts/CourseContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { FeatureGuard } from "@/components/FeatureGuard";

export default function CoursesPage() {
    return (
        <FeatureGuard>
            <CoursesPageContent />
        </FeatureGuard>
    );
}

function CoursesPageContent() {
    const { user, isLoading: userLoading } = useUser();
    const { enrollments, enrollInCourse, isEnrolled } = useCourses();
    const [enrollingCourse, setEnrollingCourse] = useState<string | null>(null);

    if (userLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-gray-400">Loading courses...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-gray-400">Please log in to view courses.</div>
            </div>
        );
    }

    // Course images by pressure room
    const courseImages = [
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1501084291732-13b1ba8f0edc?q=80&w=800&h=600&fit=crop",
    ];

    // Separate courses by enrollment status
    const enrolledCourses = SAMPLE_COURSES.filter(course => isEnrolled(course.id))
        .map(course => {
            const enrollment = enrollments.find(e => e.courseId === course.id);
            return {
                ...course,
                enrollment,
                src: courseImages[course.pressureRoom - 1],
            };
        });

    const availableCourses = SAMPLE_COURSES.filter(course => !isEnrolled(course.id))
        .map(course => ({
            ...course,
            src: courseImages[course.pressureRoom - 1],
            isLocked: course.pressureRoom > user.currentPR,
        }));

    const handleEnroll = (courseId: string) => {
        setEnrollingCourse(courseId);
        enrollInCourse(courseId);
        setTimeout(() => setEnrollingCourse(null), 1000);
    };

    // Calculate stats
    const completedCourses = enrollments.filter(e => e.completedDate).length;
    const totalLessons = enrollments.reduce((sum, e) => sum + e.lessonsCompleted.length, 0);

    return (
        <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-light mb-2">
                    My <span className="text-primary">Courses</span>
                </h1>
                <p className="text-gray-400">Continue your transformation journey</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                {[
                    { label: "Courses Enrolled", value: enrollments.length.toString(), icon: IconProgress },
                    { label: "Completed", value: completedCourses.toString(), icon: IconStar },
                    { label: "Lessons Done", value: totalLessons.toString(), icon: IconCheck },
                    { label: "Community", value: "2.5k+", icon: IconUsers },
                ].map((stat, index) => (
                    <div
                        key={index}
                        className="bg-secondary/30 border border-white/10 rounded-lg p-6 hover:border-primary/30 transition-all"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <stat.icon className="w-5 h-5 text-primary" />
                            <span className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</span>
                        </div>
                        <p className="text-3xl font-light text-primary">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Enrolled Courses */}
            {enrolledCourses.length > 0 && (
                <div className="mb-16">
                    <h2 className="text-2xl font-light mb-6">Continue Learning</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrolledCourses.map((course) => {
                            const isCompleted = course.enrollment?.completedDate;
                            const progress = course.enrollment?.progress || 0;

                            return (
                                <Link
                                    key={course.id}
                                    href={`/app/courses/${course.id}`}
                                    className="group relative bg-secondary/30 border border-white/10 rounded-xl overflow-hidden hover:border-primary/30 transition-all cursor-pointer block"
                                >
                                    {/* Course Image */}
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={course.src}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                                        {/* Status Badge */}
                                        <div className="absolute top-4 right-4">
                                            {isCompleted ? (
                                                <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                                                    Completed
                                                </div>
                                            ) : (
                                                <div className="bg-primary/20 border border-primary/50 text-primary px-3 py-1 rounded-full text-xs font-medium">
                                                    In Progress
                                                </div>
                                            )}
                                        </div>

                                        {/* Progress Bar */}
                                        {!isCompleted && (
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                                                <div
                                                    className="h-full bg-primary transition-all"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Course Info */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-light mb-4 group-hover:text-primary transition-colors">
                                            {course.title}
                                        </h3>

                                        <div className="flex items-center gap-4 text-xs text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <IconClock className="w-4 h-4" />
                                                <span>{course.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <IconStar className="w-4 h-4 text-yellow-400" />
                                                <span>{course.difficulty}</span>
                                            </div>
                                        </div>

                                        {!isCompleted && (
                                            <div className="mt-4 pt-4 border-t border-white/10">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-400">Progress</span>
                                                    <span className="text-primary font-medium">{progress}%</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Available Courses */}
            {availableCourses.length > 0 && (
                <div>
                    <h2 className="text-2xl font-light mb-6">
                        {availableCourses.some(c => !c.isLocked) ? 'Available Courses' : 'Next in Your Journey'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {availableCourses.map((course) => {
                            const isLocked = course.isLocked;
                            const isEnrolling = enrollingCourse === course.id;

                            return (
                                <motion.div
                                    key={course.id}
                                    whileHover={!isLocked ? { scale: 1.02 } : {}}
                                    className={`group relative bg-secondary/30 border border-white/10 rounded-xl overflow-hidden hover:border-primary/30 transition-all ${
                                        isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                                    }`}
                                >
                                    {/* Course Image */}
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={course.src}
                                            alt={course.title}
                                            className={`w-full h-full object-cover transition-all duration-500 ${
                                                isLocked
                                                    ? 'grayscale'
                                                    : 'group-hover:scale-110'
                                            }`}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                                        {/* Locked Badge */}
                                        {isLocked && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-full p-4">
                                                    <IconLock className="w-8 h-8 text-gray-400" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Course Info */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-light mb-2 group-hover:text-primary transition-colors">
                                            {course.title}
                                        </h3>
                                        <p className="text-sm text-gray-400 mb-4">{course.description}</p>

                                        <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                                            <div className="flex items-center gap-1">
                                                <IconClock className="w-4 h-4" />
                                                <span>{course.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <IconStar className="w-4 h-4 text-yellow-400" />
                                                <span>{course.difficulty}</span>
                                            </div>
                                        </div>

                                        {isLocked ? (
                                            <div className="pt-4 border-t border-white/10">
                                                <p className="text-xs text-gray-500">
                                                    Complete PR{course.pressureRoom - 1} to unlock
                                                </p>
                                            </div>
                                        ) : (
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleEnroll(course.id)}
                                                disabled={isEnrolling}
                                                className="w-full mt-2 bg-primary/20 border border-primary/50 text-primary px-4 py-2 rounded-lg hover:bg-primary/30 transition-all disabled:opacity-50"
                                            >
                                                {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                                            </motion.button>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
