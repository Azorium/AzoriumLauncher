import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import zipPack from 'vite-plugin-zip-pack';
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const plugins = [react(), tailwindcss()];

    if (mode == 'release') {
        plugins.push(
            zipPack({
                inDir: `dist/dev`,
                outDir: `dist`,
                outFileName: `runtime_dist.zip`,
            }),
        );
    }

    return {
        plugins: [...plugins],
        publicDir: `public/${mode}`,
        build: {
            outDir: `dist/${mode}`,
            emptyOutDir: true,
        },
    };
});
