/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/teto-egen-test', destination: '/teto-egen', permanent: true },
      { source: '/drunk-test', destination: '/drunk', permanent: true },
      { source: '/travelMood2023-test', destination: '/travelMood2023', permanent: true },
      { source: '/socialMediaHabitTest2024-test', destination: '/socialMediaHabitTest2024', permanent: true },
      { source: '/shoppingMoodTest1234-test', destination: '/shoppingMoodTest1234', permanent: true },
    ];
  },
  images: {
    domains: [
      'api-gateway.coupang.com',
      'thumbnail6.coupangcdn.com',
      'thumbnail7.coupangcdn.com',
      'thumbnail8.coupangcdn.com',
      'thumbnail9.coupangcdn.com',
      'thumbnail10.coupangcdn.com',
      'image9.coupangcdn.com',
    ],
  },
};

export default nextConfig;
