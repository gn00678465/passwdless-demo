import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: true,
  sourcemap: true,
  clean: true,
  dts: false,
  format: [
    'esm'
    // 'cjs',
    // 'iife'
  ],
  legacyOutput: false
});