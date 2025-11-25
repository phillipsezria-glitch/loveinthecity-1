import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
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
              'vendor': ['react', 'react-dom', 'react-router-dom'],
              'framer': ['framer-motion'],
              'icons': ['lucide-react'],
              'pages-home': ['./pages/HomePage.tsx'],
              'pages-discover': ['./pages/ChoosePage.tsx', './pages/CommunityPage.tsx'],
              'pages-messaging': ['./pages/MessagesPage.tsx'],
              'pages-hotel': ['./pages/HotelPage.tsx'],
              'pages-auth': ['./pages/LoginPage.tsx', './pages/SignupPage.tsx'],
              'pages-profile': ['./pages/MinePage.tsx', './pages/UserProfilePage.tsx', './pages/VipPage.tsx']
            }
          }
        }
      }
    };
});
