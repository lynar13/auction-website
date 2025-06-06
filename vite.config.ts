// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  appType: "mpa",
  base: "/", // ✅ Netlify deploys to root domain
  publicDir: "public",

  resolve: {
    alias: {
      "@js": resolve(__dirname, "src/js"),
      "@css": resolve(__dirname, "src/css"),
      "@images": resolve(__dirname, "public/images"),
      "@api": resolve(__dirname, "src/js/api"),
      "@ui": resolve(__dirname, "src/js/ui"),
      "@router": resolve(__dirname, "src/js/router"),
      "@utils": resolve(__dirname, "src/js/utilities"),
      "@types": resolve(__dirname, "src/js/types"),
    },
  },

  build: {
    target: "esnext",
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "auth/login/index.html"),
        register: resolve(__dirname, "auth/register/index.html"),
        profile: resolve(__dirname, "profile/index.html"),
        listing: resolve(__dirname, "listing/index.html"),
        editListing: resolve(__dirname, "listing/edit/index.html"),
        createListing: resolve(__dirname, "listing/create/index.html"),
        listings: resolve(__dirname, "listings/index.html"),
      },
    },
  },

  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
}));
