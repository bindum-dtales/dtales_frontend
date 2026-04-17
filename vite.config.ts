import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 5173,
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
        // Enable hashed filenames for all output files
        rollupOptions: {
          output: {
            // Hash entry chunks
            entryFileNames: 'assets/[name].[hash].js',
            // Hash chunk files
            chunkFileNames: 'assets/[name].[hash].js',
            // Hash asset files (CSS, images, etc.)
            assetFileNames: 'assets/[name].[hash][extname]'
          }
        },
        // Generate manifest for tracking old/new file mappings
        manifest: true,
        // Ensure cache busting on every build
        sourcemap: false,
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      }
    };
});
