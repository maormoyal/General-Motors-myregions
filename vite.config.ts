import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxying requests for images
      '/api': {
        target: 'https://myregions.azurewebsites.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\//, ''),
      },
    },
  },
});
