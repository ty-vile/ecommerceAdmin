/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "ecom-images-bucket.s3.ap-southeast-2.amazonaws.com",
    ],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
