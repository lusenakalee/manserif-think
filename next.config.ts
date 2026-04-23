import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
      unoptimized: true,

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
        search: '',
      },
       {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
     
    ],
  },
};

export default nextConfig;
