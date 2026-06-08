import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => ({
    plugins: [react()],
    publicDir: `public/${mode}`,
    build: {
        outDir: `dist/${mode}`,
        emptyOutDir: true,
    },

}))
