/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@worldforge/game-core", "@worldforge/types"],
};

export default nextConfig;
