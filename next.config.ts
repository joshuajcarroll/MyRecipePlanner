/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // OLD: domains: ['example.com'], // This is deprecated
    // NEW: Use remotePatterns instead
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com', // Replace with your actual image host
        port: '',
        pathname: '/**', // Allows any path on this hostname
      },
      // Add other remote patterns for other image hosts if needed, e.g.:
      // {
      //   protocol: 'https',
      //   hostname: 'res.cloudinary.com',
      //   port: '',
      //   pathname: '/**',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'images.unsplash.com',
      //   port: '',
      //   pathname: '/**',
      // },
    ],
  },
};

module.exports = nextConfig;