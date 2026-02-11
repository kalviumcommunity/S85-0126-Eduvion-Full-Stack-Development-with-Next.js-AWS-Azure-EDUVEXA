import type { NextConfig } from "next";



const nextConfig: NextConfig = {

  /* config options here */

  reactCompiler: true,

  // External packages for server components
  serverExternalPackages: ['sharp'],

  experimental: {

    optimizeCss: true,

    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],

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

