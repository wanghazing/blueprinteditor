import { defineConfig, loadEnv, ConfigEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";

const pathResolve = (dir: string) => {
  return resolve(__dirname, ".", dir);
};

const alias: Record<string, string> = {
  "/@": pathResolve("./src/"),
};
// https://vitejs.dev/config/
export default defineConfig((mode: ConfigEnv) => {
  const env = loadEnv(mode.mode, process.cwd());
  console.log(env);
  return {
    plugins: [vue(), vueJsx()],
    resolve: { alias },
    base: env.VITE_BASE_DIR,
    server: {
      host: "0.0.0.0",
      port: 8000,
      open: false,
      hmr: true,
      proxy: {
        "/api": {
          target: "http://127.0.0.1:1444/",
          ws: true,
          changeOrigin: true,
          // rewrite: (path) => {
          //   console.log(path)
          //   return path.replace(/^\/api/, "")
          // },
        },
      },
    },
  };
});
