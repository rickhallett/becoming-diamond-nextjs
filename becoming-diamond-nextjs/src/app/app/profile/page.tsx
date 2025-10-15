"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconEdit, IconCheck, IconX, IconCamera, IconMail, IconMapPin, IconBriefcase } from "@tabler/icons-react";
import { useUser } from "@/contexts/UserContext";
import { FEATURES } from "@/config/features";

export default function ProfilePage() {
    const { user, updateProfile, isLoading } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        location: "",
        occupation: "",
        bio: "",
        website: "",
    });

    // Load user data into form when available
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                phone: "",
                location: user.location || "",
                occupation: "",
                bio: user.bio || "",
                website: user.website || "",
            });
        }
    }, [user]);

    // Show loading state while fetching user data OR if user is not yet loaded
    // This prevents the "Please log in" flash when navigating between pages
    if (isLoading || !user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-gray-400">Loading profile...</div>
            </div>
        );
    }

    // Build stats array based on feature flags
    type StatItem = { label: string; value: string; color: string };
    const stats: StatItem[] = [
        FEATURES.coursesCompleted ? { label: "Courses Completed", value: user.completedPRs.length.toString(), color: "text-green-400" } : null,
        { label: "Active Pressure Room", value: `PR${user.currentPR}`, color: "text-primary" },
        { label: "Current Level", value: user.level, color: "text-purple-400" },
        FEATURES.xpPoints ? { label: "XP Points", value: user.xp.toString(), color: "text-yellow-400" } : null
    ].filter((stat): stat is StatItem => stat !== null); // Remove disabled features

    // Build achievements array based on feature flags
    const achievements = FEATURES.achievements ? [
        { name: "First PR Complete", earned: user.completedPRs.length >= 1 },
        { name: "30-Day Streak", earned: user.streak >= 30 },
        { name: "Community Contributor", earned: user.xp >= 100 },
        { name: "Transformation Leader", earned: user.completedPRs.length >= 3 },
        { name: "Master of Presence", earned: user.level === "Master" },
        { name: "PR Champion", earned: user.completedPRs.length >= 5 }
    ] : [];

    const handleSave = () => {
        // Update user profile with form data
        updateProfile({
            name: formData.name,
            email: formData.email,
            location: formData.location,
            bio: formData.bio,
            website: formData.website,
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        // Reset form data to user's current data
        setFormData({
            name: user.name,
            email: user.email,
            phone: "",
            location: user.location || "",
            occupation: "",
            bio: user.bio || "",
            website: user.website || "",
        });
        setIsEditing(false);
    };

    // Calculate days since joining
    const daysSinceJoining = Math.floor(
        (Date.now() - new Date(user.joinedDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    // Format join date
    const joinDate = new Date(user.joinedDate).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="max-w-5xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-light mb-2">
                    My <span className="text-primary">Profile</span>
                </h1>
                <p className="text-gray-400">Manage your personal information and track your progress</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-secondary/30 border border-white/10 rounded-xl p-6">
                        {/* Avatar */}
                        <div className="relative w-32 h-32 mx-auto mb-4 group cursor-pointer">
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/40 to-primary/10 flex items-center justify-center text-4xl font-light">
                                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </div>
                            )}
                            <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <IconCamera className="w-8 h-8 text-white" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-light text-center mb-1">{user.name}</h2>
                        <p className="text-sm text-gray-400 text-center mb-4">{user.level}</p>

                        {/* Quick Stats */}
                        <div className="space-y-3 pt-4 border-t border-white/10">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Current Pressure Room</span>
                                <span className="text-primary font-medium">PR{user.currentPR}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Member Since</span>
                                <span className="text-white">{joinDate}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Days Active</span>
                                <span className="text-white">{daysSinceJoining}</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid - Only show if there are stats to display */}
                    {stats.length > 0 && (
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="bg-secondary/30 border border-white/10 rounded-lg p-4"
                                >
                                    <p className={`text-2xl font-light ${stat.color}`}>{stat.value}</p>
                                    <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Profile Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Information */}
                    <div className="bg-secondary/30 border border-white/10 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-light">Personal Information</h3>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 text-primary rounded-lg hover:bg-primary/30 transition-all"
                                >
                                    <IconEdit className="w-4 h-4" />
                                    <span className="text-sm">Edit</span>
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSave}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
                                    >
                                        <IconCheck className="w-4 h-4" />
                                        <span className="text-sm">Save</span>
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                                    >
                                        <IconX className="w-4 h-4" />
                                        <span className="text-sm">Cancel</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="name" className="text-gray-300 mb-2 block">Full Name</Label>
                                {isEditing ? (
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 text-white">
                                        <IconBriefcase className="w-4 h-4 text-gray-400" />
                                        {user.name}
                                    </div>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="email" className="text-gray-300 mb-2 block">Email Address</Label>
                                {isEditing ? (
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 text-white">
                                        <IconMail className="w-4 h-4 text-gray-400" />
                                        {user.email || 'Not set'}
                                    </div>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <Label htmlFor="location" className="text-gray-300 mb-2 block">Location</Label>
                                {isEditing ? (
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="City, State/Country"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 text-white">
                                        <IconMapPin className="w-4 h-4 text-gray-400" />
                                        {user.location || 'Not set'}
                                    </div>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <Label htmlFor="website" className="text-gray-300 mb-2 block">Website</Label>
                                {isEditing ? (
                                    <Input
                                        id="website"
                                        type="url"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        placeholder="https://yourwebsite.com"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 text-white">
                                        {user.website || 'Not set'}
                                    </div>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <Label htmlFor="bio" className="text-gray-300 mb-2 block">Bio</Label>
                                {isEditing ? (
                                    <textarea
                                        id="bio"
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        rows={3}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-colors"
                                        placeholder="Tell us about yourself..."
                                    />
                                ) : (
                                    <p className="text-white">{user.bio || 'No bio yet'}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Achievements - Only show if feature is enabled */}
                    {FEATURES.achievements && achievements.length > 0 && (
                        <div className="bg-secondary/30 border border-white/10 rounded-xl p-6">
                            <h3 className="text-xl font-light mb-6">Achievements</h3>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {achievements.map((achievement, index) => (
                                    <div
                                        key={index}
                                        className={`text-center p-4 rounded-lg border transition-all ${
                                            achievement.earned
                                                ? "bg-primary/10 border-primary/30"
                                                : "bg-black/20 border-white/10 opacity-40"
                                        }`}
                                    >
                                        <div className="text-3xl mb-2">
                                            {achievement.earned ? "★" : "☆"}
                                        </div>
                                        <p className="text-xs text-gray-300">{achievement.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
