import { defineConfig } from 'vite';
import { resolve } from 'path';
import { cpSync, existsSync, mkdirSync } from 'fs';

// Plugin to copy src/assets to dist/src/assets so HTML paths resolve
function copyStaticAssets() {
  return {
    name: 'copy-static-assets',
    closeBundle() {
      const srcDir = resolve(__dirname, 'src/assets');
      const destDir = resolve(__dirname, 'dist/src/assets');
      if (existsSync(srcDir)) {
        mkdirSync(destDir, { recursive: true });
        cpSync(srcDir, destDir, { recursive: true });
      }
    },
  };
}

export default defineConfig({
  // Root is project root where index.html lives
  root: '.',

  // Base path for GitHub Pages — update if deploying to a subdirectory
  // e.g. '/repo-name/' for https://username.github.io/repo-name/
  base: './',

  plugins: [copyStaticAssets()],

  // CSS processing
  css: {
    // Enable CSS minification in production
    devSourcemap: true,
  },

  build: {
    // Output directory
    outDir: 'dist',

    // Clean output directory before build
    emptyOutDir: true,

    // Asset handling
    assetsDir: 'assets',

    // Generate source maps for debugging production issues
    sourcemap: false,

    // Minification (Vite 8 uses oxc by default)
    minify: true,

    // Chunk splitting
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        work: resolve(__dirname, 'work.html'),
        'font-test': resolve(__dirname, 'font-test.html'),
        'work/nla-enlighten': resolve(__dirname, 'work/nla-enlighten.html'),
        'work/bundaberg': resolve(__dirname, 'work/bundaberg.html'),
        'work/gryff': resolve(__dirname, 'work/gryff.html'),
        'work/porsche-drjack': resolve(__dirname, 'work/porsche-drjack.html'),
        'work/rams-construction': resolve(__dirname, 'work/rams-construction.html'),
        'work/weightless': resolve(__dirname, 'work/weightless.html'),
      },
      output: {
        // Asset file naming with hashes for cache busting
        assetFileNames: (assetInfo) => {
          // Keep fonts in their own directory
          if (/\.(otf|woff|woff2|ttf|eot)$/.test(assetInfo.name)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          // CSS
          if (/\.css$/.test(assetInfo.name)) {
            return 'assets/css/[name]-[hash][extname]';
          }
          // Default assets
          return 'assets/[name]-[hash][extname]';
        },
        // JS chunk naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },

    // Increase chunk size warning limit (Matter.js is large)
    chunkSizeWarningLimit: 600,
  },

  // Dev server
  server: {
    open: true,
    port: 3000,
  },

  // Preview server (for testing production build locally)
  preview: {
    port: 4173,
    open: true,
  },
});
