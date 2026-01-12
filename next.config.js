/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['localhost', 'pedido-rapido.com'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['@mui/icons-material', '@mui/material'],
  },
};

module.exports = nextConfig;

