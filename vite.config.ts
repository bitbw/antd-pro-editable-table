import { defineConfig, loadEnv } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  console.log(`[BOWEN_LOG] 🚀 ~~ defineConfig ~~ VITE_NODE_ENV:`, env);
  console.log(`[BOWEN_LOG] 🚀 ~~ defineConfig ~~ mode:`, mode);
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
