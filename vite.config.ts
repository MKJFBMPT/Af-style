import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * AF STYLE - Advanced Vite Configuration
 * This setup enables a secure proxy to communicate with Replicate AI 
 * and prevents CORS issues during development.
 */
export default defineConfig(({ mode }) => {
  // .env.local ফাইল থেকে সিক্রেট টোকেন লোড করা হচ্ছে
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        // ১. নতুন এআই রিকোয়েস্ট পাঠানোর প্রক্সি
        '/api/try-on': {
          target: 'https://api.replicate.com/v1/predictions',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/try-on/, ''),
          headers: {
            'Authorization': `Token ${env.VITE_REPLICATE_API_TOKEN}`,
            'Content-Type': 'application/json',
          }
        },
        // ২. এআই রেজাল্ট চেক করার প্রক্সি (Polling)
        '/api/status': {
          target: 'https://api.replicate.com/v1/predictions',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/status/, ''),
          headers: {
            'Authorization': `Token ${env.VITE_REPLICATE_API_TOKEN}`,
          }
        }
      },
    },
  };
});