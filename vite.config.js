import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  appType: "mpa",
  base: mode === "production" ? "/auction-website/" : "/", // Add base path only in production
  publicDir: "public",
  resolve: {
    alias: {
      "@js": resolve(__dirname, "src/js"),   // Alias for JS files
      "@css": resolve(__dirname, "src/css"), // Alias for CSS
      "@images": resolve(__dirname, "public/images"), // Alias for images
      '@api': resolve(__dirname, 'src/js/api'), // Alias for API folder
      '@ui': resolve(__dirname, 'src/js/ui'), // Alias for UI folder
      '@router': resolve(__dirname, 'src/js/router'), // Alias for Router folder 
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
}));

// // Alias example for easier imports
// "@api": resolve(__dirname, "src/js/api"),  // Alias for the api folder
// "@ui": resolve(__dirname, "src/js/ui"),    // Alias for the ui folder
// "@router": resolve(__dirname, "src/js/router"), // Alias for the router folder