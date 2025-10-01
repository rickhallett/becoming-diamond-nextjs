"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { IconBell, IconShield, IconPalette, IconMoon, IconSun } from "@tabler/icons-react";

export default function SettingsPage() {
  const [theme, setTheme] = useState("dark");
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    updates: true,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-light mb-8">Settings</h1>

      {/* Theme Section */}
      <section className="mb-12">
        <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-4 flex items-center space-x-2">
          <IconPalette className="w-4 h-4" />
          <span>Appearance</span>
        </h2>
        
        <div className="flex space-x-2">
          {[
            { value: "light", icon: IconSun, label: "Light" },
            { value: "dark", icon: IconMoon, label: "Dark" },
          ].map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  theme === option.value
                    ? "border-purple-500/50 bg-purple-500/10"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{option.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Notifications Section */}
      <section className="mb-12">
        <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-4 flex items-center space-x-2">
          <IconBell className="w-4 h-4" />
          <span>Notifications</span>
        </h2>
        
        <div className="space-y-3">
          {Object.entries({
            email: "Email notifications",
            push: "Push notifications",
            updates: "Product updates",
          }).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between py-2">
              <span className="text-sm">{label}</span>
              <button
                onClick={() => toggleNotification(key as keyof typeof notifications)}
                className={`relative w-10 h-6 rounded-full transition-colors ${
                  notifications[key as keyof typeof notifications] 
                    ? "bg-purple-500/30" 
                    : "bg-white/10"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    notifications[key as keyof typeof notifications]
                      ? "translate-x-5"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Security Section */}
      <section className="mb-12">
        <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-4 flex items-center space-x-2">
          <IconShield className="w-4 h-4" />
          <span>Security</span>
        </h2>
        
        <div className="space-y-4">
          <button className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 transition-colors rounded-lg text-sm">
            Change Password
          </button>
          <button className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 transition-colors rounded-lg text-sm">
            Enable Two-Factor Authentication
          </button>
          <button className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 transition-colors rounded-lg text-sm">
            Manage Sessions
          </button>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="pt-8 border-t border-white/5">
        <h2 className="text-sm uppercase tracking-wider text-red-500/50 mb-4">Danger Zone</h2>
        <button className="px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors rounded-lg text-sm">
          Delete Account
        </button>
      </section>
    </div>
  );
}