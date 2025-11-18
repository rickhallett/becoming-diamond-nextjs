"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconEdit, IconCheck, IconX, IconCamera, IconMail, IconMapPin, IconBriefcase } from "@tabler/icons-react";
import { useUser } from "@/contexts/UserContext";

export default function ProfilePage() {
    const router = useRouter();
    const { status } = useSession();
    const { user, updateProfile, isLoading } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        location: "",
        occupation: "",
        bio: "",
        website: "",
    });

    // Redirect to sign-in if unauthenticated
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }
    }, [status, router]);

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
    if (status === 'loading' || isLoading || !user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-gray-400">Loading profile...</div>
            </div>
        );
    }

    // No achievements for simplified MVP
    const achievements: { name: string; earned: boolean }[] = [];

    const handleSave = () => {
        // Update user profile with form data (email is read-only)
        updateProfile({
            name: formData.name,
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

            <div className="grid lg:grid-cols-3 gap-6 lg:items-stretch">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-secondary/30 border border-white/10 rounded-xl p-6 h-full flex flex-col">
                        {/* Avatar */}
                        <div className="relative w-32 h-32 mx-auto mb-4 group cursor-pointer">
                            <Image
                                src={user.avatar && !imageError ? user.avatar : '/profile-placeholder-2.webp'}
                                alt={user.name}
                                fill
                                className="rounded-full object-cover"
                                onError={() => setImageError(true)}
                            />
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
                </div>

                {/* Profile Details */}
                <div className="lg:col-span-2">
                    {/* Personal Information */}
                    <div className="bg-secondary/30 border border-white/10 rounded-xl p-6 h-full">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-light">Personal Information</h3>
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
                                <Label htmlFor="name" className="text-gray-400 text-sm mb-2 block">Full Name</Label>
                                {isEditing ? (
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 text-white text-sm">
                                        <IconBriefcase className="w-4 h-4 text-gray-400" />
                                        {user.name}
                                    </div>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="email" className="text-gray-400 text-sm mb-2 block">Email Address</Label>
                                <div className="flex items-center gap-2 text-white text-sm">
                                    <IconMail className="w-4 h-4 text-gray-400" />
                                    {user.email || 'Not set'}
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <Label htmlFor="location" className="text-gray-400 text-sm mb-2 block">Location</Label>
                                {isEditing ? (
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="City, State/Country"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 text-white text-sm">
                                        <IconMapPin className="w-4 h-4 text-gray-400" />
                                        {user.location || 'Not set'}
                                    </div>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <Label htmlFor="website" className="text-gray-400 text-sm mb-2 block">Website</Label>
                                {isEditing ? (
                                    <Input
                                        id="website"
                                        type="url"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        placeholder="https://yourwebsite.com"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 text-white text-sm">
                                        {user.website || 'Not set'}
                                    </div>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <Label htmlFor="bio" className="text-gray-400 text-sm mb-2 block">Bio</Label>
                                {isEditing ? (
                                    <textarea
                                        id="bio"
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        rows={3}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-colors"
                                        placeholder="Tell us about yourself..."
                                    />
                                ) : (
                                    <p className="text-white text-sm">{user.bio || 'No bio yet'}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Achievements - Disabled for simplified MVP */}
                    {false && achievements.length > 0 && (
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
