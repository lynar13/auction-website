import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  appType: "mpa",
  base: "/auction-website/",
  publicDir: "public",
  resolve: {
    alias: {
      // Alias example for easier imports
      "@api": resolve(__dirname, "src/js/api"),  // Alias for the api folder
      "@ui": resolve(__dirname, "src/js/ui"),    // Alias for the ui folder
    },
  },
  build: {
    target: "esnext",
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
});
