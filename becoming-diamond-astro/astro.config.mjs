// @ts-check
import { defineConfig } from "astro/config";
import decapCmsOauth from "astro-decap-cms-oauth";
import vercel from "@astrojs/vercel";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel({
    webAnalytics: {
      enabled: true
    }
  }),
  integrations: [
    decapCmsOauth({
      adminPath: '/admin',
      oauthLoginRoute: '/oauth'
    }),
    react(),
    tailwind()
  ],
  server: {
    host: true,
    port: 4321,
    allowedHosts: ["localhost", "127.0.0.1"]
  },
  vite: {
    build: {
      cssMinify: true,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'motion-vendor': ['framer-motion'],
            'particles-vendor': ['@tsparticles/react', '@tsparticles/engine', '@tsparticles/slim']
          }
        }
      }
    }
  }
});
