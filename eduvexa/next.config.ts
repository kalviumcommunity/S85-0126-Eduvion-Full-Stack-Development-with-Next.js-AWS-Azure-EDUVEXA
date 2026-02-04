import type { NextConfig } from "next";



const nextConfig: NextConfig = {

  /* config options here */

  reactCompiler: true,

  experimental: {

    optimizeCss: true,

    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],

    // Enable compression

    serverComponentsExternalPackages: ['sharp'],

  },

  compress: true,

  poweredByHeader: false,

  // Image optimization

  images: {

    domains: [],

    formats: ['image/webp', 'image/avif'],

    minimumCacheTTL: 60,

    dangerouslyAllowSVG: true,

    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

  },

};



export default nextConfig;

