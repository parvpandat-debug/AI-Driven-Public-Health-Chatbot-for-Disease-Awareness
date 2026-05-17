import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const xaiApiKey = env.XAI_API_KEY || env.VITE_XAI_API_KEY;

  return {
    plugins: [react()],
    server: {
      proxy: xaiApiKey
        ? {
            '/api/gemini': {
              target: 'https://generativelanguage.googleapis.com',
              changeOrigin: true,
              secure: true,
              rewrite: path => path.replace(/^\/api\/gemini/, ''),
              configure: proxy => {
                proxy.on('proxyReq', proxyReq => {
                  proxyReq.setHeader('Content-Type', 'application/json');
                  proxyReq.setHeader('Authorization', `Bearer ${xaiApiKey}`);
                  proxyReq.setHeader('x-goog-api-key', xaiApiKey);
                });
              },
            },
          }
        : undefined,
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
