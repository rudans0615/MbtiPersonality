/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [{ source: '/teto-egen-test', destination: '/teto-egen', permanent: true }];
  },
  images: {
    domains: ["api-gateway.coupang.com", "thumbnail6.coupangcdn.com", "thumbnail7.coupangcdn.com", "thumbnail8.coupangcdn.com", "thumbnail9.coupangcdn.com", "thumbnail10.coupangcdn.com", "image9.coupangcdn.com"],
  },
};

export default nextConfig;
