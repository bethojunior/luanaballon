/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  experimental: { serverComponentsExternalPackages: ['mysql2', 'minio'] },
};

export default nextConfig;
