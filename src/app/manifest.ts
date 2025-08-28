import {
  APP_DEFAULT_TITLE,
  APP_DESCRIPTION,
  APP_NAME,
} from '@/config/appInfoConfig';
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    // Main details
    name: APP_DEFAULT_TITLE,
    short_name: APP_NAME,
    description: APP_DESCRIPTION,

    // Extra info
    id: 'nova_v1_24339440',
    dir: 'ltr',
    lang: 'en',
    categories: ['finance', 'lifestyle', 'wellness'],
    prefer_related_applications: false,

    // Configure appearance
    orientation: 'portrait',
    start_url: '/home', // Relative is fine here; browser resolves to absolute
    display: 'standalone',

    // Styling and Branding
    theme_color: '#f9f9f9',
    background_color: '#f9f9f9',
    icons: [
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
