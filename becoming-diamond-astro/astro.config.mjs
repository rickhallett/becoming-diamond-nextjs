// @ts-check
import { defineConfig } from "astro/config";
import decapCmsOauth from "astro-decap-cms-oauth";
import vercel from "@astrojs/vercel";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [
    decapCmsOauth(),
    tailwind()
  ],
  server: {
    host: true,
    port: 4321,
    allowedHosts: ["localhost", "127.0.0.1"]
  }
});
