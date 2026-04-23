import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwind from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [
    tailwind(),
    vue({ features: { optionsAPI: false } }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
    },
  },
  base: '/trunk/',
  build: {
    copyPublicDir: true,
    emptyOutDir: true,
    minify: true,
    sourcemap: false,
  },
});
