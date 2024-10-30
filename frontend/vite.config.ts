import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { terser } from "rollup-plugin-terser"; // terser 임포트

export default defineConfig({
  plugins: [
    react(),
    terser({
      compress: {
        drop_console: true,
      },
    }),
  ],
  server: {
    host: "127.0.0.1", // IPv4 주소 명시
    port: 3000, // 사용 가능한 포트 번호
  },
  build: {
    rollupOptions: {},
  },
  test: {
    globals: true,
    environment: "jsdom",
  },
});
