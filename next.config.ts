import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['images.unsplash.com'],
  },
  turbopack: {
    root: path.join(__dirname, '.'),
  },
  allowedDevOrigins: [
    'local-origin.dev',
    '*.local-origin.dev',
    '192.168.0.109',
  ],
};

export default nextConfig;
