"use client";
import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IconBell, IconLock, IconPalette, IconShield, IconCreditCard } from "@tabler/icons-react";

export default function SettingsPage() {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [courseReminders, setCourseReminders] = useState(true);
    const [communityUpdates, setCommunityUpdates] = useState(false);
    const [darkMode, setDarkMode] = useState(true);

    const tabs = [
        {
            title: "Notifications",
            value: "notifications",
            content: (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-light mb-4 flex items-center gap-2">
                            <IconBell className="w-5 h-5 text-primary" />
                            Notification Preferences
                        </h3>

                        <div className="space-y-4">
                            {[
                                {
                                    label: "Email Notifications",
                                    description: "Receive updates and course information via email",
                                    value: emailNotifications,
                                    onChange: setEmailNotifications
                                },
                                {
                                    label: "Push Notifications",
                                    description: "Get real-time updates in your browser",
                                    value: pushNotifications,
                                    onChange: setPushNotifications
                                },
                                {
                                    label: "Course Reminders",
                                    description: "Receive reminders for upcoming lessons and deadlines",
                                    value: courseReminders,
                                    onChange: setCourseReminders
                                },
                                {
                                    label: "Community Updates",
                                    description: "Stay informed about community events and discussions",
                                    value: communityUpdates,
                                    onChange: setCommunityUpdates
                                }
                            ].map((setting, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 bg-secondary/30 border border-white/10 rounded-lg"
                                >
                                    <div className="flex-1">
                                        <p className="text-white font-light">{setting.label}</p>
                                        <p className="text-sm text-gray-400 mt-1">{setting.description}</p>
                                    </div>
                                    <button
                                        onClick={() => setting.onChange(!setting.value)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                            setting.value ? "bg-primary" : "bg-gray-600"
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                setting.value ? "translate-x-6" : "translate-x-1"
                                            }`}
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Security",
            value: "security",
            content: (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-light mb-4 flex items-center gap-2">
                            <IconLock className="w-5 h-5 text-primary" />
                            Security Settings
                        </h3>

                        <div className="space-y-6">
                            <div className="bg-secondary/30 border border-white/10 rounded-lg p-6">
                                <h4 className="text-lg font-light mb-4">Change Password</h4>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="current-password" className="text-gray-300">Current Password</Label>
                                        <Input id="current-password" type="password" className="mt-2" />
                                    </div>
                                    <div>
                                        <Label htmlFor="new-password" className="text-gray-300">New Password</Label>
                                        <Input id="new-password" type="password" className="mt-2" />
                                    </div>
                                    <div>
                                        <Label htmlFor="confirm-password" className="text-gray-300">Confirm New Password</Label>
                                        <Input id="confirm-password" type="password" className="mt-2" />
                                    </div>
                                    <button className="bg-primary text-black px-6 py-2 rounded-lg hover:bg-primary/90 transition-all">
                                        Update Password
                                    </button>
                                </div>
                            </div>

                            <div className="bg-secondary/30 border border-white/10 rounded-lg p-6">
                                <h4 className="text-lg font-light mb-2 flex items-center gap-2">
                                    <IconShield className="w-5 h-5 text-green-400" />
                                    Two-Factor Authentication
                                </h4>
                                <p className="text-sm text-gray-400 mb-4">
                                    Add an extra layer of security to your account
                                </p>
                                <button className="bg-green-500/20 border border-green-500/30 text-green-400 px-6 py-2 rounded-lg hover:bg-green-500/30 transition-all">
                                    Enable 2FA
                                </button>
                            </div>

                            <div className="bg-secondary/30 border border-white/10 rounded-lg p-6">
                                <h4 className="text-lg font-light mb-2">Active Sessions</h4>
                                <p className="text-sm text-gray-400 mb-4">Manage your active login sessions</p>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                                        <div>
                                            <p className="text-sm text-white">Chrome on MacOS</p>
                                            <p className="text-xs text-gray-500">Los Angeles, CA - Current session</p>
                                        </div>
                                        <span className="text-xs text-green-400">Active</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Appearance",
            value: "appearance",
            content: (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-light mb-4 flex items-center gap-2">
                            <IconPalette className="w-5 h-5 text-primary" />
                            Appearance Settings
                        </h3>

                        <div className="bg-secondary/30 border border-white/10 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h4 className="text-lg font-light">Dark Mode</h4>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Use dark theme across the application
                                    </p>
                                </div>
                                <button
                                    onClick={() => setDarkMode(!darkMode)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        darkMode ? "bg-primary" : "bg-gray-600"
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            darkMode ? "translate-x-6" : "translate-x-1"
                                        }`}
                                    />
                                </button>
                            </div>

                            <div className="pt-6 border-t border-white/10">
                                <h4 className="text-lg font-light mb-4">Theme Color</h4>
                                <div className="grid grid-cols-4 gap-3">
                                    {[
                                        { name: "Cyan", color: "#4fc3f7" },
                                        { name: "Purple", color: "#9333ea" },
                                        { name: "Green", color: "#10b981" },
                                        { name: "Orange", color: "#f59e0b" }
                                    ].map((theme, index) => (
                                        <button
                                            key={index}
                                            className="flex flex-col items-center gap-2 p-3 bg-black/30 border border-white/10 rounded-lg hover:border-primary/30 transition-all"
                                        >
                                            <div
                                                className="w-12 h-12 rounded-full"
                                                style={{ backgroundColor: theme.color }}
                                            />
                                            <span className="text-xs text-gray-400">{theme.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Billing",
            value: "billing",
            content: (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-light mb-4 flex items-center gap-2">
                            <IconCreditCard className="w-5 h-5 text-primary" />
                            Billing & Subscription
                        </h3>

                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-lg p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h4 className="text-lg font-light">Full Program</h4>
                                        <p className="text-sm text-gray-400 mt-1">Active subscription</p>
                                    </div>
                                    <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-400 rounded-full text-xs">
                                        Active
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-400">Amount</span>
                                    <span className="text-2xl font-light text-primary">$497</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">Next billing date</span>
                                    <span className="text-white">February 1, 2025</span>
                                </div>
                            </div>

                            <div className="bg-secondary/30 border border-white/10 rounded-lg p-6">
                                <h4 className="text-lg font-light mb-4">Payment Method</h4>
                                <div className="flex items-center justify-between p-4 bg-black/30 border border-white/10 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-7 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
                                            VISA
                                        </div>
                                        <div>
                                            <p className="text-sm text-white">•••• •••• •••• 4242</p>
                                            <p className="text-xs text-gray-500">Expires 12/26</p>
                                        </div>
                                    </div>
                                    <button className="text-sm text-primary hover:underline">Update</button>
                                </div>
                            </div>

                            <div className="bg-secondary/30 border border-white/10 rounded-lg p-6">
                                <h4 className="text-lg font-light mb-4">Billing History</h4>
                                <div className="space-y-2">
                                    {[
                                        { date: "Jan 1, 2025", amount: "$497", status: "Paid" },
                                        { date: "Dec 1, 2024", amount: "$497", status: "Paid" }
                                    ].map((invoice, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-black/30 rounded-lg"
                                        >
                                            <span className="text-sm text-gray-400">{invoice.date}</span>
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm text-white">{invoice.amount}</span>
                                                <span className="text-xs text-green-400">{invoice.status}</span>
                                                <button className="text-xs text-primary hover:underline">Download</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="max-w-5xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-light mb-2">
                    <span className="text-primary">Settings</span>
                </h1>
                <p className="text-gray-400">Manage your account preferences and settings</p>
            </div>

            <Tabs
                tabs={tabs}
                containerClassName="mb-8"
                activeTabClassName="bg-primary/20 border-primary/30"
                tabClassName="text-gray-400 hover:text-white transition-colors"
                contentClassName="mt-8"
            />
        </div>
    );
}
