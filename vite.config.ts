import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import zip from 'vite-plugin-zip-pack'
import { viteStaticCopy } from 'vite-plugin-static-copy';
import manifest from './src/manifest.json';

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
    zip({ outDir: 'release', outFileName: 'tran-scend.zip' }),
    viteStaticCopy({
      targets: [
        {
          src: 'src/content/index.css',
          dest: 'src/content'
        }
      ]
    })
  ],

  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
