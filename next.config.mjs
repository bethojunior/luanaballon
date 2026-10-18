/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  experimental: { serverComponentsExternalPackages: ['mongoose', 'minio'] },
};

export default nextConfig;
