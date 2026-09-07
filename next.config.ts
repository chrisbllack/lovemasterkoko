import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
    // Cap build workers — the sandbox enforces a 2 GB memory limit and
    // spawning one worker per core (64) causes the build to be OOM-killed.
    // A single worker keeps peak memory under the cgroup limit.
    cpus: 1,
  },
};

export default nextConfig;
