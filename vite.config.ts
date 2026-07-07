import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 4700,
      strictPort: true,
      host: '0.0.0.0',
      watch: {
        // Windows EBUSY при больших .webp в public — игнорируем через функцию (надёжнее glob на Win)
        ignored: (filepath: string) => {
          const p = filepath.replace(/\\/g, '/');
          return (
            p.includes('/public/palette/') ||
            p.includes('/public/styles/') ||
            p.includes('/public/marketing/pickers/') ||
            p.includes('/public/marketing/videos/') ||
            p.includes('/public/shorts/presets/') ||
            p.includes('/public/video/how-it-works/') ||
            p.includes('/public/video/demos/')
          );
        },
      },
    },
    plugins: [react()],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
            icons: ['lucide-react']
          }
        }
      }
    }
  };
});
