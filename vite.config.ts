/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Helper functions للتعامل مع env variables
const getEnv = (key: string, defaultValue: string): string => {
  return (process.env[key] as string) || defaultValue;
};

const getEnvNumber = (key: string, defaultValue: number): number => {
  const value = process.env[key] as string;
  return value ? parseInt(value) : defaultValue;
};

// Helper للـ package version
const getPackageVersion = (): string => {
  return (process.env.npm_package_version as string) || "1.0.0";
};

export default defineConfig({
  tanstackStart: {
    // server: { entry: "server" },
    nitro: {
      preset: "node-server",
    },
  },
  vite: {
    server: {
      host: "0.0.0.0", // ✅ غيرها لـ 0.0.0.0 عشان تقبل أي مضيف
      port: getEnvNumber("VITE_DEV_SERVER_PORT", 7000),
      strictPort: false, // ✅ يخلي المنفذ يتغير لو مشغول
      allowedHosts: true, // ✅ صيغة array عشان تتأكد
      proxy: {
        "/api": {
          target: getEnv("VITE_API_TARGET", "https://apipay.wsa-elite.com/"),
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, getEnv("VITE_API_REWRITE_PATH", "/api")),
          configure: (proxy) => {
            const apiHeaderName = getEnv("VITE_API_HEADER_NAME", "X-Requested-With");
            const apiHeaderValue = getEnv("VITE_API_HEADER_VALUE", "XMLHttpRequest");

            proxy.on("proxyReq", (proxyReq, req) => {
              if (getEnv("NODE_ENV", "production") === "development") {
                console.log("Sending Request:", req.method, req.url);
              }
              proxyReq.setHeader(apiHeaderName, apiHeaderValue);
            });

            proxy.on("proxyRes", (proxyRes, req) => {
              if (getEnv("NODE_ENV", "production") === "development") {
                console.log("Response Status:", proxyRes.statusCode, req.url);
              }
            });
          },
        },
        "/sanctum": {
          target: getEnv("VITE_SANCTUM_TARGET", "https://apipay.wsa-elite.com/"),
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq, req) => {
              if (getEnv("NODE_ENV", "production") === "development") {
                console.log("Sanctum Request:", req.method, req.url);
              }
            });
          },
        },
      },
    },
    preview: {
      host: "0.0.0.0", // ✅ نفس الشيء للـ preview
      port: getEnvNumber("VITE_PREVIEW_SERVER_PORT", 7002),
      strictPort: false,
      allowedHosts: true,
    },
    css: {
      modules: {
        localsConvention: "camelCase",
      },
    },
    build: {
      cssCodeSplit: true,
      sourcemap: false,
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
          chunkFileNames: "chunks/[name].js",
          assetFileNames: "assets/[name].[ext]",
        },
      },
    },
    define: {
      "import.meta.env.VITE_APP_VERSION": JSON.stringify(getPackageVersion()),
      "import.meta.env.VITE_BUILD_TIME": JSON.stringify(new Date().toISOString()),
    },
  },
});