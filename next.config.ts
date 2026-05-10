/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: ["http://localhost:3000"], // or whatever your frontend URL is
  },
  images: {
    // allow cloudinary and similar hosts used in the static data
    domains: ["res.cloudinary.com"],
  },
};


const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

module.exports = withPWA(nextConfig);
