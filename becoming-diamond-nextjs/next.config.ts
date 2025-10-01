import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
    ],
  },
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
