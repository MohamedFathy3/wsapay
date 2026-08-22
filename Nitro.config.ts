import { defineNitroConfig } from "nitro/config";

const trimTrailingSlash = (value: string): string => value.replace(/\/+$/, "");

const apiTarget = trimTrailingSlash(process.env.VITE_API_TARGET || "https://apipay.wsa-elite.com");
const sanctumTarget = trimTrailingSlash(
  process.env.VITE_SANCTUM_TARGET || "https://apipay.wsa-elite.com",
);

export default defineNitroConfig({
  routeRules: {
    "/api/**": {
      proxy: `${apiTarget}/**`,
    },
    "/sanctum/**": {
      proxy: `${sanctumTarget}/**`,
    },
  },
});
