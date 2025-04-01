import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import wasm from "vite-plugin-wasm";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [
    react(),
    wasm(),
    viteStaticCopy({
      targets: [
        // { src: "src/index.html", dest: "" },
        { src: "node_modules/scichart/_wasm/scichart2d.data", dest: "" },
        { src: "node_modules/scichart/_wasm/scichart2d.wasm", dest: "" },
      ],
    }),
  ],
});
