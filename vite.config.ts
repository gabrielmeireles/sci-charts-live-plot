import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import wasm from 'vite-plugin-wasm';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    wasm(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        // { src: "src/index.html", dest: "" },
        { src: 'node_modules/scichart/_wasm/scichart2d.data', dest: '' },
        { src: 'node_modules/scichart/_wasm/scichart2d.wasm', dest: '' },
      ],
    }),
  ],
});
