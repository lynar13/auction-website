// vite.config.js
export default {
    server: {
      port: 5500, // Change the port number (default is 3000)
      open: true, // Automatically open the browser on server start
      proxy: {
        // Set up a proxy for API requests
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  };