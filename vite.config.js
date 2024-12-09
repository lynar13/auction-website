import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  appType: "mpa",
  base: "/auction-website/",
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
        bids: resolve(__dirname, "bids/index.html"),
        listings: resolve(__dirname, "listings/index.html"),
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/css/variables.scss";` // Optional global SCSS variables/mixins
      },
    },
  },
});
