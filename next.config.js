/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public'
})

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

module.exports = {...nextConfig,   ...withPWA(
  pluginOptions = {
    dest: 'public',
    register: true,
    skipWaiting: true,
    // fallbacks: {
    //   document: '/_offline.tsx',
    // },
    publicExcludes: ['**/*'],
    buildExcludes:[() => true]
    // dynamicStartUrl: true
  }
)}
