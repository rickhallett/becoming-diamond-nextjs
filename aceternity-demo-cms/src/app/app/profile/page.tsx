"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconEdit, IconCheck, IconX, IconCamera, IconMail, IconPhone, IconMapPin, IconBriefcase } from "@tabler/icons-react";

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "Sarah Diamond",
        email: "sarah.diamond@example.com",
        phone: "+1 (555) 123-4567",
        location: "Los Angeles, CA",
        occupation: "Executive Coach",
        bio: "Passionate about personal transformation and helping others break through limitations. On a journey to master presence under pressure.",
        gateway: "Gateway 2: Shift",
        joinDate: "January 2025"
    });

    const stats = [
        { label: "Courses Completed", value: "1", color: "text-green-400" },
        { label: "Active Gateway", value: "2", color: "text-primary" },
        { label: "Days Active", value: "45", color: "text-purple-400" },
        { label: "Community Rank", value: "Top 15%", color: "text-yellow-400" }
    ];

    const achievements = [
        { name: "First Gateway Complete", earned: true },
        { name: "30-Day Streak", earned: true },
        { name: "Community Contributor", earned: true },
        { name: "Transformation Leader", earned: false },
        { name: "Master of Presence", earned: false },
        { name: "Gateway Champion", earned: false }
    ];

    const handleSave = () => {
        setIsEditing(false);
        // In a real app, save to backend
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset form data
    };

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
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/40 to-primary/10 flex items-center justify-center text-4xl font-light">
                                SD
                            </div>
                            <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <IconCamera className="w-8 h-8 text-white" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-light text-center mb-1">{formData.name}</h2>
                        <p className="text-sm text-gray-400 text-center mb-4">{formData.occupation}</p>

                        {/* Quick Stats */}
                        <div className="space-y-3 pt-4 border-t border-white/10">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Current Gateway</span>
                                <span className="text-primary font-medium">{formData.gateway}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Member Since</span>
                                <span className="text-white">{formData.joinDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
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
                                        {formData.name}
                                    </div>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="occupation" className="text-gray-300 mb-2 block">Occupation</Label>
                                {isEditing ? (
                                    <Input
                                        id="occupation"
                                        value={formData.occupation}
                                        onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 text-white">
                                        <IconBriefcase className="w-4 h-4 text-gray-400" />
                                        {formData.occupation}
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
                                        {formData.email}
                                    </div>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="phone" className="text-gray-300 mb-2 block">Phone Number</Label>
                                {isEditing ? (
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 text-white">
                                        <IconPhone className="w-4 h-4 text-gray-400" />
                                        {formData.phone}
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
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 text-white">
                                        <IconMapPin className="w-4 h-4 text-gray-400" />
                                        {formData.location}
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
                                    />
                                ) : (
                                    <p className="text-white">{formData.bio}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Achievements */}
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
                </div>
            </div>
        </div>
    );
}
