import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: {
    resolve: true,
  },
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    'lucide-react',
    /^@radix-ui\//,
  ],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
  loader: {
    '.css': 'local-css',
  },
  // Bundle CSS modules
  injectStyle: false,
  // Disable incremental to avoid conflicts
  tsconfig: './tsconfig.json',
});
