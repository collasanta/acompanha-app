/** @type {import('next').NextConfig} */

// const withPWA = require('next-pwa')({
//   dest: 'public'
// })
// const withPWA = require("@ducanh2912/next-pwa").default({
//   dest: "public",
//   register: false,
//   skipWaiting: true,
// });

const nextConfig = {
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
}

module.exports = {...nextConfig,   ...require("@ducanh2912/next-pwa").default(
  pluginOptions = {
    dest: 'public',
    register: false,
    skipWaiting: true,
    reloadOnOnline: true, 
    // fallbacks: {
    //   document: '/_offline.tsx',
    // },
    // publicExcludes: ['**/*'],
    // buildExcludes:[() => true]
    // dynamicStartUrl: true
  }
)}
