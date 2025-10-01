"use client";
import { IconClock, IconUsers, IconStar, IconProgress, IconLock } from "@tabler/icons-react";

export default function CoursesPage() {
    const enrolledCourses = [
        {
            title: "Gateway 1: Stabilize",
            src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&h=600&fit=crop",
            progress: 65,
            duration: "5 weeks",
            students: "2,543",
            rating: 4.9,
            status: "in-progress"
        },
        {
            title: "Gateway 2: Shift",
            src: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=800&h=600&fit=crop",
            progress: 30,
            duration: "6 weeks",
            students: "1,892",
            rating: 4.8,
            status: "in-progress"
        },
        {
            title: "The Diamond Operating System",
            src: "https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?q=80&w=800&h=600&fit=crop",
            progress: 100,
            duration: "4 weeks",
            students: "3,421",
            rating: 5.0,
            status: "completed"
        },
    ];

    const availableCourses = [
        {
            title: "Gateway 3: Strengthen",
            src: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=800&h=600&fit=crop",
            duration: "6 weeks",
            students: "1,234",
            rating: 4.9,
            status: "locked"
        },
        {
            title: "Gateway 4: Shine",
            src: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=800&h=600&fit=crop",
            duration: "7 weeks",
            students: "987",
            rating: 4.8,
            status: "locked"
        },
        {
            title: "Gateway 5: Synthesize",
            src: "https://images.unsplash.com/photo-1501084291732-13b1ba8f0edc?q=80&w=800&h=600&fit=crop",
            duration: "8 weeks",
            students: "765",
            rating: 5.0,
            status: "locked"
        },
    ];

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
                    { label: "Courses Enrolled", value: "3", icon: IconProgress },
                    { label: "Completed", value: "1", icon: IconStar },
                    { label: "Hours Learned", value: "42", icon: IconClock },
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
            <div className="mb-16">
                <h2 className="text-2xl font-light mb-6">Continue Learning</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrolledCourses.map((course, index) => (
                        <div
                            key={index}
                            className="group relative bg-secondary/30 border border-white/10 rounded-xl overflow-hidden hover:border-primary/30 transition-all cursor-pointer"
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
                                    {course.status === "completed" && (
                                        <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                                            Completed
                                        </div>
                                    )}
                                    {course.status === "in-progress" && (
                                        <div className="bg-primary/20 border border-primary/50 text-primary px-3 py-1 rounded-full text-xs font-medium">
                                            In Progress
                                        </div>
                                    )}
                                </div>

                                {/* Progress Bar */}
                                {course.progress && course.progress < 100 && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                                        <div
                                            className="h-full bg-primary transition-all"
                                            style={{ width: `${course.progress}%` }}
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
                                        <IconUsers className="w-4 h-4" />
                                        <span>{course.students}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <IconStar className="w-4 h-4 text-yellow-400" />
                                        <span>{course.rating}</span>
                                    </div>
                                </div>

                                {course.progress && course.progress < 100 && (
                                    <div className="mt-4 pt-4 border-t border-white/10">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-400">Progress</span>
                                            <span className="text-primary font-medium">{course.progress}%</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Available Courses */}
            <div>
                <h2 className="text-2xl font-light mb-6">
                    Next in Your Journey
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableCourses.map((course, index) => (
                        <div
                            key={index}
                            className="group relative bg-secondary/30 border border-white/10 rounded-xl overflow-hidden hover:border-primary/30 transition-all cursor-pointer opacity-60 hover:opacity-80"
                        >
                            {/* Course Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={course.src}
                                    alt={course.title}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-[50%] transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                                {/* Locked Badge */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-full p-4">
                                        <IconLock className="w-8 h-8 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Course Info */}
                            <div className="p-6">
                                <h3 className="text-xl font-light mb-4">
                                    {course.title}
                                </h3>

                                <div className="flex items-center gap-4 text-xs text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <IconClock className="w-4 h-4" />
                                        <span>{course.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <IconUsers className="w-4 h-4" />
                                        <span>{course.students}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <IconStar className="w-4 h-4 text-yellow-400" />
                                        <span>{course.rating}</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <p className="text-xs text-gray-500">
                                        Complete previous gateways to unlock
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
