/** @type {import('next').NextConfig} */
const nextConfig = {
  // webpack: (config) => {
  //   config.resolve.extensions.push(".ts", ".tsx");
  //   return config;
  // },
  reactStrictMode: true,
  images: {
    domains: ["s.gravatar.com"],
  },
};

module.exports = nextConfig;
