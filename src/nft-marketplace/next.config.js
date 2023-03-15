/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    MARKETPLACE_SMART_CONTRACT: process.env.MARKETPLACE_SMART_CONTRACT,
    IPFS_GATEWAY: process.env.IPFS_GATEWAY
  }
}

module.exports = nextConfig
