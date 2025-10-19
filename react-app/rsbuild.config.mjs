import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  server: {
    proxy: {
      '/api': {
        target: 'http://team-04-hyn9y74f.hack.prodcontest.ru',
        changeOrigin: true,
        secure: false,
        logLevel: 'debug'
      }
    }
  },
  dev: {
    host: '0.0.0.0',
    port: 3000
  }
});
