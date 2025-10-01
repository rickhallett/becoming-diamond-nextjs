"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IconUser, IconMail, IconEdit } from "@tabler/icons-react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    role: "AI Engineer",
    bio: "Building intelligent systems that make a difference.",
  });

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-light">Profile</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center space-x-2 px-4 py-2 text-sm bg-white/5 hover:bg-white/10 transition-colors rounded-lg"
        >
          <IconEdit className="w-4 h-4" />
          <span>{isEditing ? "Cancel" : "Edit"}</span>
        </button>
      </div>

      {/* Avatar Section */}
      <div className="flex items-center space-x-6 mb-12">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
          <IconUser className="w-12 h-12 text-white/50" />
        </div>
        <div>
          <h2 className="text-xl font-medium mb-1">{profile.name}</h2>
          <p className="text-sm text-gray-500">{profile.role}</p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        <div>
          <Label htmlFor="name" className="text-xs uppercase tracking-wider text-gray-500">
            Name
          </Label>
          <Input
            id="name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            disabled={!isEditing}
            className="mt-1 bg-white/5 border-white/10 disabled:opacity-50"
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-xs uppercase tracking-wider text-gray-500">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            disabled={!isEditing}
            className="mt-1 bg-white/5 border-white/10 disabled:opacity-50"
          />
        </div>

        <div>
          <Label htmlFor="role" className="text-xs uppercase tracking-wider text-gray-500">
            Role
          </Label>
          <Input
            id="role"
            value={profile.role}
            onChange={(e) => setProfile({ ...profile, role: e.target.value })}
            disabled={!isEditing}
            className="mt-1 bg-white/5 border-white/10 disabled:opacity-50"
          />
        </div>

        <div>
          <Label htmlFor="bio" className="text-xs uppercase tracking-wider text-gray-500">
            Bio
          </Label>
          <textarea
            id="bio"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            disabled={!isEditing}
            rows={3}
            className="mt-1 w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-50 resize-none"
          />
        </div>
      </div>

      {/* Save Button */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8"
        >
          <button
            onClick={() => setIsEditing(false)}
            className="w-full py-3 bg-white/10 hover:bg-white/20 transition-colors rounded-lg"
          >
            Save Changes
          </button>
        </motion.div>
      )}

      {/* Stats */}
      <div className="mt-12 pt-12 border-t border-white/5">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Projects", value: "12" },
            { label: "Models", value: "48" },
            { label: "API Calls", value: "156K" },
            { label: "Team", value: "8" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-2xl font-light text-white/80">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}