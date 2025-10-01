"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { IconTrendingUp, IconFlame, IconTarget, IconCalendar, IconUsers, IconBook, IconSparkles, IconBolt, IconChevronRight, IconDiamond, IconCheck } from "@tabler/icons-react";
import { useUser } from "@/contexts/UserContext";
import { useCourses, SAMPLE_COURSES } from "@/contexts/CourseContext";

function AppDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useUser();
  const { enrollments, getRecentActivities } = useCourses();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Check for success parameter from Stripe redirect
  useEffect(() => {
    const success = searchParams.get('success');
    if (success === 'true') {
      console.log('[Dashboard] Payment success detected, user:', user ? 'logged in' : 'not logged in');
      console.log('[Dashboard] Auth loading state:', isLoading);
      setShowSuccessMessage(true);
      // Clear the success parameter from URL after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
        router.replace('/app', { scroll: false });
      }, 5000);
    }
  }, [searchParams, router, user, isLoading]);

  // Calculate days in program
  const daysInProgram = user ? Math.floor(
    (Date.now() - new Date(user.joinedDate).getTime()) / (1000 * 60 * 60 * 24)
  ) : 0;

  // Calculate completed sessions from enrollments
  const completedLessons = enrollments.reduce((total, enrollment) => {
    return total + enrollment.lessonsCompleted.length;
  }, 0);

  const totalLessons = SAMPLE_COURSES.slice(0, user?.currentGateway || 1).reduce((total, course) => {
    return total + course.lessons.length;
  }, 0);

  // User progress data
  const userStats = {
    currentGateway: user?.currentGateway || 1,
    daysInProgram,
    currentStreak: user?.streak || 0,
    completedSessions: completedLessons,
    totalSessions: totalLessons || 4,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-400">Please log in to view your dashboard.</div>
      </div>
    );
  }

  const gatewayNames = ["Foundation", "Emotional Intelligence", "Mental Clarity", "Physical Mastery", "Integration"];
  const gateways = gatewayNames.map((name, index) => {
    const gatewayNumber = index + 1;
    const isCompleted = user.completedGateways.includes(gatewayNumber);
    const isInProgress = gatewayNumber === user.currentGateway;

    return {
      name,
      completed: isCompleted,
      inProgress: isInProgress,
      color: `from-primary/${30 + index * 10} to-primary/${10 + index * 5}`,
    };
  });

  const upcomingSessions = [
    { title: `Gateway ${user.currentGateway}: ${gatewayNames[user.currentGateway - 1]}`, date: "Oct 5, 2025", time: "10:00 AM PST", type: "Live Session" },
    { title: "Integration Lab", date: "Oct 8, 2025", time: "2:00 PM PST", type: "Group Coaching" },
    { title: "Swiss Army Knife Workshop", date: "Oct 12, 2025", time: "11:00 AM PST", type: "Workshop" },
  ];

  // Get recent activities from CourseContext
  const recentActivitiesData = getRecentActivities(4);
  const recentActivity = recentActivitiesData.length > 0
    ? recentActivitiesData.map(activity => {
        const timeAgo = getTimeAgo(new Date(activity.timestamp));
        return {
          action: activity.description,
          time: timeAgo,
        };
      })
    : [
        { action: "Welcome to Becoming Diamond!", time: "Just now" },
        { action: "Profile created", time: "Just now" },
      ];

  // Helper function to calculate time ago
  function getTimeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  }

  // Find current course for quick action
  const currentCourse = SAMPLE_COURSES.find(c => c.gateway === user.currentGateway);
  const currentEnrollment = currentCourse ? enrollments.find(e => e.courseId === currentCourse.id) : null;

  return (
    <div className="min-h-full relative">
      {/* Success Message */}
      {showSuccessMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-xl p-4 flex items-center gap-3"
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <IconCheck className="w-6 h-6 text-green-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-medium mb-1">Payment Successful!</h3>
            <p className="text-sm text-gray-300">
              Thank you for your purchase. Your book will be delivered to your email shortly.
            </p>
          </div>
          <button
            onClick={() => setShowSuccessMessage(false)}
            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      )}

      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl md:text-4xl font-light">
            Welcome Back, <span className="text-primary">{user.name.split(' ')[0]}</span>
          </h1>
          <motion.div
            animate={{
              boxShadow: [
                "0 0 20px rgba(79,195,247,0.3)",
                "0 0 40px rgba(79,195,247,0.5)",
                "0 0 20px rgba(79,195,247,0.3)",
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 flex items-center justify-center"
          >
            <IconDiamond className="w-6 h-6 text-primary" />
          </motion.div>
        </div>
        <p className="text-gray-400">Day {userStats.daysInProgram} of your transformation journey</p>
      </motion.div>

      {/* Gateway Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8"
      >
        <h2 className="text-xl mb-4 flex items-center gap-2">
          <IconTarget className="w-5 h-5 text-primary" />
          Your Gateway Journey
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {gateways.map((gateway, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`relative group cursor-pointer bg-gradient-to-b ${gateway.color} rounded-xl p-4 border transition-all ${
                gateway.inProgress
                  ? "border-primary shadow-lg shadow-primary/30"
                  : gateway.completed
                  ? "border-primary/40"
                  : "border-white/10"
              }`}
            >
              <div className="text-center">
                <div className="text-2xl font-light mb-2 text-primary" style={{
                  filter: `drop-shadow(0 0 ${8 + index * 2}px rgba(79,195,247,${0.3 + index * 0.1}))`
                }}>
                  Gateway {index + 1}
                </div>
                <div className="text-sm mb-2">{gateway.name}</div>
                {gateway.completed && (
                  <div className="text-xs text-primary">Completed</div>
                )}
                {gateway.inProgress && (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-xs text-primary font-semibold"
                  >
                    In Progress
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <IconFlame className="w-5 h-5 text-orange-400" />
            <span className="text-sm text-gray-400">Current Streak</span>
          </div>
          <div className="text-3xl font-light text-primary">{userStats.currentStreak}</div>
          <div className="text-xs text-gray-500 mt-1">days</div>
        </div>

        <div className="bg-secondary/50 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <IconTrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-sm text-gray-400">Sessions</span>
          </div>
          <div className="text-3xl font-light">{userStats.completedSessions}/{userStats.totalSessions}</div>
          <div className="text-xs text-gray-500 mt-1">completed</div>
        </div>

        <div className="bg-secondary/50 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <IconCalendar className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-gray-400">Days Active</span>
          </div>
          <div className="text-3xl font-light">{userStats.daysInProgram}</div>
          <div className="text-xs text-gray-500 mt-1">total days</div>
        </div>

        <div className="bg-secondary/50 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <IconDiamond className="w-5 h-5 text-primary" />
            <span className="text-sm text-gray-400">Gateway</span>
          </div>
          <div className="text-3xl font-light">{userStats.currentGateway}/5</div>
          <div className="text-xs text-gray-500 mt-1">current</div>
        </div>
      </motion.div>

      {/* Main Bento Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <BentoGrid className="mb-8">
          {/* Diamond Sprint Tracker */}
          <BentoGridItem
            title="Diamond Sprint Tracker"
            description="Track your daily practices and build unshakable habits"
            header={
              <div className="flex h-full min-h-[8rem] w-full flex-1 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 p-4">
                <div className="flex flex-col justify-between w-full">
                  <div className="flex items-center gap-2 mb-3">
                    <IconSparkles className="w-5 h-5 text-primary" />
                    <span className="text-sm text-gray-300">30-Day Practice</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 21 }).map((_, i) => (
                      <div
                        key={i}
                        className={`aspect-square rounded ${
                          i < 12 ? "bg-primary" : i < 19 ? "bg-primary/30" : "bg-white/10"
                        }`}
                        style={{
                          boxShadow: i < 12 ? "0 0 8px rgba(79,195,247,0.5)" : "none",
                        }}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-gray-400 mt-2">12 days completed this sprint</div>
                </div>
              </div>
            }
            className="md:col-span-2"
          />

          {/* Upcoming Sessions */}
          <BentoGridItem
            title="Upcoming Sessions"
            description="Your scheduled live sessions and workshops"
            header={
              <div className="flex h-full min-h-[8rem] w-full flex-1 rounded-xl bg-gradient-to-br from-secondary/50 to-black p-4">
                <div className="space-y-2 w-full">
                  {upcomingSessions.slice(0, 2).map((session, i) => (
                    <div key={i} className="bg-white/5 rounded-lg p-2 border border-white/10">
                      <div className="text-xs text-primary mb-1">{session.type}</div>
                      <div className="text-sm font-light">{session.title}</div>
                      <div className="text-xs text-gray-500 mt-1">{session.date} at {session.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            }
            className="md:col-span-1"
          />

          {/* Swiss Army Knife Tools */}
          <BentoGridItem
            title="Swiss Army Knife"
            description="Real-time emotional regulation tools"
            header={
              <div className="flex h-full min-h-[8rem] w-full flex-1 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 relative overflow-hidden">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute w-32 h-32 bg-primary/30 rounded-full blur-3xl"
                />
                <div className="relative z-10 text-center">
                  <IconBolt className="w-12 h-12 text-primary mx-auto mb-2" />
                  <div className="text-sm text-gray-300">3 Active Tools</div>
                </div>
              </div>
            }
          />

          {/* Community Activity */}
          <BentoGridItem
            title="DiamondMind Collective"
            description="Connect with your transformation community"
            header={
              <div className="flex h-full min-h-[8rem] w-full flex-1 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-4">
                <div className="flex flex-col justify-between w-full">
                  <div className="flex items-center gap-2 mb-3">
                    <IconUsers className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-gray-300">1,247 Active Members</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-400">Recent: &quot;Gateway 3 Integration Lab&quot;</div>
                    <div className="text-xs text-gray-400">34 members online now</div>
                  </div>
                </div>
              </div>
            }
          />

          {/* Course Library */}
          <BentoGridItem
            title="Course Library"
            description="Access your gateway content and resources"
            header={
              <div className="flex h-full min-h-[8rem] w-full flex-1 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20">
                <div className="text-center">
                  <IconBook className="w-12 h-12 text-orange-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-300">23 Modules Available</div>
                  <div className="text-xs text-gray-500 mt-1">8 Completed</div>
                </div>
              </div>
            }
            className="md:col-span-2"
          />
        </BentoGrid>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid md:grid-cols-2 gap-6"
      >
        <div>
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <IconTrendingUp className="w-5 h-5 text-primary" />
            Recent Activity
          </h2>
          <div className="space-y-2">
            {recentActivity.map((activity, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-secondary/50 border border-white/10 rounded-lg p-4 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300 group-hover:text-white transition-colors">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                  <IconChevronRight className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <IconBolt className="w-5 h-5 text-primary" />
            Quick Actions
          </h2>
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(79,195,247,0.3)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/app/courses')}
              className="w-full bg-gradient-to-r from-primary/30 to-primary/10 border border-primary/50 rounded-lg p-4 text-left hover:border-primary transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium mb-1">
                    {currentEnrollment ? 'Continue' : 'Start'} Gateway {user.currentGateway}
                  </div>
                  <div className="text-xs text-gray-400">
                    {currentCourse?.title.split(': ')[1] || gatewayNames[user.currentGateway - 1]}
                    {currentEnrollment && ` - ${currentEnrollment.progress}% complete`}
                  </div>
                </div>
                <IconChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/app/profile')}
              className="w-full bg-secondary/50 border border-white/10 rounded-lg p-4 text-left hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium mb-1">Update Profile</div>
                  <div className="text-xs text-gray-400">Manage your progress and achievements</div>
                </div>
                <IconChevronRight className="w-5 h-5 text-gray-500 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/app/chat')}
              className="w-full bg-secondary/50 border border-white/10 rounded-lg p-4 text-left hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium mb-1">Chat with DiamondMindAI</div>
                  <div className="text-xs text-gray-400">Get personalized guidance</div>
                </div>
                <IconChevronRight className="w-5 h-5 text-gray-500 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/app/support')}
              className="w-full bg-secondary/50 border border-white/10 rounded-lg p-4 text-left hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium mb-1">Get Support</div>
                  <div className="text-xs text-gray-400">Help and resources</div>
                </div>
                <IconChevronRight className="w-5 h-5 text-gray-500 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AppDashboard() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-400">Loading dashboard...</div>
      </div>
    }>
      <AppDashboardContent />
    </Suspense>
  );
}
