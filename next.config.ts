import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // The client api helper (src/lib/api.ts) fetches /server/* on this origin;
  // proxy those calls to the Express API, which serves its routes under /api/*.
  async rewrites() {
    return [
      {
        source: "/server/:path*",
        destination: `${process.env.API_URL ?? "http://localhost:7000"}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
