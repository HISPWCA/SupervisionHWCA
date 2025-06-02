import { defineConfig } from 'vite';

export default defineConfig({
    esbuild: {
        include: /\.(js|ts)$/, // files to transform
        loader: 'jsx' // treat these files as JSX
    }
});
