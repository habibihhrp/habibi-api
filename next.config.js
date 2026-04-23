/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["@distube/ytdl-core", "@prisma/client", "bcryptjs"],
  },
};

module.exports = nextConfig;
