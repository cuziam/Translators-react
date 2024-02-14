import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { terser } from "rollup-plugin-terser"; // terser 임포트

export default defineConfig({
  plugins: [
    react(),
    terser({
      // terser 플러그인 추가
      compress: {
        drop_console: true, // 콘솔 로그 제거
      },
    }),
  ],
  build: {
    rollupOptions: {},
  },
});
