import type { NextConfig } from 'next';
import path from 'node:path';
import withSerwistInit from '@serwist/next';
import 'dotenv/config';

const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
});

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
    process.env.DEV_ORIGIN as string,
    process.env.NETWORK_ORIGIN as string,
  ],
  experimental: {
    reactCompiler: true,
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        process.env.DEV_ORIGIN as string,
        '*.devtunnels.ms',
      ],
    },
  },
};

export default withSerwist(nextConfig);
