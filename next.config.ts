// next.config.ts
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  sassOptions: {
    // Resolves the absolute path cleanly regardless of where the SCSS file lives
    additionalData: `@use "${path.join(process.cwd(), "src/styles/variables")}" as *;`,
  },
};

export default nextConfig;