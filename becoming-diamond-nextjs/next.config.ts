import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Ignore LICENSE files to prevent parsing errors
    config.module.rules.push({
      test: /LICENSE$/,
      type: 'asset/source',
    });
    return config;
  },
};

export default nextConfig;
