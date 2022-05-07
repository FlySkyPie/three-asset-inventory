import { defineConfig } from 'vite';
import * as path from 'path';

export default defineConfig(({ command, mode }) => {
    if (command === 'serve') {
        return {
            // dev specific config
        }
    }
    // command === 'build'
    return {
        build: {
            lib: {
                entry: path.resolve(__dirname, 'src/index.ts'),
                name: 'three-asset-inventory',
                fileName: (format) => `lib.${format}.js`
            },
            rollupOptions: {
                external: ['three'],
                output: {
                }
            }
        }
    }
})