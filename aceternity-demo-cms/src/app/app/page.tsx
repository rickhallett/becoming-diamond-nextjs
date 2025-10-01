"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function AppDashboard() {
  const [activeMetric, setActiveMetric] = useState(0);
  
  const metrics = [
    { label: "Active", value: "2,543", trend: "+12%", color: "text-blue-400" },
    { label: "Processed", value: "12.8k", trend: "+8%", color: "text-purple-400" },
    { label: "Latency", value: "23ms", trend: "-15%", color: "text-green-400" },
    { label: "Uptime", value: "99.9%", trend: "0%", color: "text-orange-400" },
  ];

  const activities = [
    { time: "Now", action: "Model training started", type: "process" },
    { time: "2m", action: "API request processed", type: "api" },
    { time: "5m", action: "Cache updated", type: "system" },
    { time: "12m", action: "New deployment", type: "deploy" },
    { time: "1h", action: "Backup completed", type: "system" },
  ];

  return (
    <div className="min-h-full">
      {/* Metrics Grid - Inventive layout */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 mb-8">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            onHoverStart={() => setActiveMetric(index)}
            className="relative group cursor-pointer"
          >
            <div className="aspect-square bg-white/[0.02] border border-white/[0.05] p-6 flex flex-col justify-between hover:bg-white/[0.04] transition-colors">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">{metric.label}</p>
                <p className={`text-3xl font-light mt-2 ${metric.color}`}>{metric.value}</p>
              </div>
              <p className="text-xs text-gray-600">{metric.trend}</p>
              
              {/* Active indicator */}
              {activeMetric === index && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute inset-0 border border-purple-500/30 pointer-events-none"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area - Split view */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Activity Stream */}
        <div className="lg:col-span-2">
          <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-4">Activity Stream</h2>
          <div className="space-y-[1px]">
            {activities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/[0.02] border border-white/[0.05] p-4 hover:bg-white/[0.04] transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-1 h-8 ${
                      activity.type === 'process' ? 'bg-blue-500' :
                      activity.type === 'api' ? 'bg-purple-500' :
                      activity.type === 'deploy' ? 'bg-green-500' :
                      'bg-gray-500'
                    } opacity-50 group-hover:opacity-100 transition-opacity`} />
                    <div>
                      <p className="text-white/90">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time} ago</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Status Panel */}
        <div>
          <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-4">System Status</h2>
          <div className="bg-white/[0.02] border border-white/[0.05] p-6">
            {/* Visual Status Indicator */}
            <div className="relative h-32 mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-24 h-24 rounded-full bg-green-500/20"
                />
                <div className="absolute w-12 h-12 rounded-full bg-green-500/40" />
                <div className="absolute w-4 h-4 rounded-full bg-green-500" />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">API</span>
                <span className="text-xs text-green-400">Operational</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Database</span>
                <span className="text-xs text-green-400">Healthy</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Cache</span>
                <span className="text-xs text-green-400">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Queue</span>
                <span className="text-xs text-yellow-400">12 pending</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 space-y-2">
            <button className="w-full text-left px-4 py-3 bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors text-sm">
              Deploy Changes
            </button>
            <button className="w-full text-left px-4 py-3 bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors text-sm">
              View Logs
            </button>
            <button className="w-full text-left px-4 py-3 bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors text-sm">
              Run Diagnostics
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Minimal graph visualization */}
      <div className="mt-8 h-24 bg-white/[0.02] border border-white/[0.05] p-4">
        <div className="flex items-end justify-between h-full">
          {Array.from({ length: 24 }, (_, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${Math.random() * 100}%` }}
              transition={{ delay: i * 0.02, duration: 0.5 }}
              className="w-full mx-[1px] bg-gradient-to-t from-purple-500/50 to-transparent"
            />
          ))}
        </div>
      </div>
    </div>
  );
}