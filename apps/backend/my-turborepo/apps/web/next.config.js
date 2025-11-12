/** @type {import('next').NextConfig} */
const nextConfig = {};

nextConfig.exports = {
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
}
export default nextConfig;
