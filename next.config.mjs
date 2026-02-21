/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // ← THIS CREATES THE out/ FOLDER
  trailingSlash: true,
  images: {
    unoptimized: true, // required for export
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
