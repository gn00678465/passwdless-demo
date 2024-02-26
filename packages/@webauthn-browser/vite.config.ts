import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';

export default defineConfig({
    plugins: [dts({ rollupTypes: true })],
    build: {
        sourcemap: true,
        lib: {
            entry: resolve(__dirname, 'src/main.ts'),
            name: 'main',
            formats: ['es', 'cjs', 'umd'],
            fileName: (format) => `index.${format}.js`
        }
    }
})