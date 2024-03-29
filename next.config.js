const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  workboxOptions: {
    skipWaiting: true,
  }
  // buildExcludes: [/\/_next\/static\/.*\.js/],
  // reloadOnOnline: true,
});

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '**',
      },
    ],
  },
};

module.exports = withPWA(nextConfig);
