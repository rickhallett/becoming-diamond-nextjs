"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconEdit, IconCheck, IconX, IconCamera, IconMail, IconMapPin, IconBriefcase, IconLock, IconEye, IconEyeOff } from "@tabler/icons-react";
import { useUser } from "@/contexts/UserContext";
import { PASSWORD_MIN_LENGTH } from "@/lib/password";

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

    // Password management state
    const [hasPassword, setHasPassword] = useState<boolean | null>(null);
    const [isSettingPassword, setIsSettingPassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);

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

    // Check if user has a password set
    useEffect(() => {
        if (status === 'authenticated') {
            fetch('/api/profile/password')
                .then(res => res.json())
                .then(data => {
                    setHasPassword(data.hasPassword ?? false);
                })
                .catch(() => {
                    setHasPassword(false);
                });
        }
    }, [status]);

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

    // Password handling functions
    const handleSetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordSuccess(false);
        setIsPasswordLoading(true);

        try {
            const res = await fetch('/api/profile/password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: passwordForm.password,
                    confirmPassword: passwordForm.confirmPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setPasswordError(data.error || 'Failed to set password');
                return;
            }

            setPasswordSuccess(true);
            setHasPassword(true);
            setIsSettingPassword(false);
            setPasswordForm({ password: "", confirmPassword: "" });
        } catch {
            setPasswordError('An unexpected error occurred');
        } finally {
            setIsPasswordLoading(false);
        }
    };

    const handleCancelPassword = () => {
        setIsSettingPassword(false);
        setPasswordForm({ password: "", confirmPassword: "" });
        setPasswordError(null);
        setPasswordSuccess(false);
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

                    {/* Password Settings */}
                    <div className="bg-secondary/30 border border-white/10 rounded-xl p-6 mt-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <IconLock className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-light">Password Settings</h3>
                            </div>
                            {!isSettingPassword && (
                                <button
                                    onClick={() => setIsSettingPassword(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 text-primary rounded-lg hover:bg-primary/30 transition-all"
                                >
                                    <IconEdit className="w-4 h-4" />
                                    <span className="text-sm">{hasPassword ? 'Change' : 'Set Password'}</span>
                                </button>
                            )}
                        </div>

                        {passwordSuccess && (
                            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm flex items-center gap-2">
                                <IconCheck className="w-4 h-4" />
                                Password {hasPassword ? 'updated' : 'set'} successfully
                            </div>
                        )}

                        {!isSettingPassword ? (
                            <div className="text-sm text-gray-400">
                                {hasPassword === null ? (
                                    <span>Loading...</span>
                                ) : hasPassword ? (
                                    <div className="flex items-center gap-2">
                                        <IconCheck className="w-4 h-4 text-green-400" />
                                        <span>Password is set. You can sign in with email and password.</span>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="mb-2">No password set.</p>
                                        <p className="text-gray-500">
                                            Set a password to sign in directly from home screen shortcuts or when magic links are inconvenient.
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <form onSubmit={handleSetPassword} className="space-y-4">
                                {passwordError && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                                        {passwordError}
                                    </div>
                                )}

                                <div>
                                    <Label htmlFor="password" className="text-gray-400 text-sm mb-2 block">
                                        {hasPassword ? 'New Password' : 'Password'}
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={passwordForm.password}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                                            placeholder={`Minimum ${PASSWORD_MIN_LENGTH} characters`}
                                            required
                                            minLength={PASSWORD_MIN_LENGTH}
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Must contain at least one letter and one number
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="confirmPassword" className="text-gray-400 text-sm mb-2 block">
                                        Confirm Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={passwordForm.confirmPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                            placeholder="Confirm your password"
                                            required
                                            minLength={PASSWORD_MIN_LENGTH}
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                        >
                                            {showConfirmPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={isPasswordLoading || !passwordForm.password || !passwordForm.confirmPassword}
                                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-black font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isPasswordLoading ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <IconCheck className="w-4 h-4" />
                                                {hasPassword ? 'Update Password' : 'Set Password'}
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancelPassword}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 transition-all"
                                    >
                                        <IconX className="w-4 h-4" />
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
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
