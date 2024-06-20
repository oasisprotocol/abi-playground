// @ts-check
// eslint-disable-next-line @typescript-eslint/no-var-requires

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // For static github pages deploy
  images: { unoptimized: true }, // Not supported in export mode
  // basePath: "/sapphire-abi-playground",

  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  productionBrowserSourceMaps: true,
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};

export default nextConfig;
