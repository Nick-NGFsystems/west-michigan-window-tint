/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://app.ngfsystems.com https://*.vercel.app",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
