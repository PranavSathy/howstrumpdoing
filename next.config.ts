import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // see https://nextjs.org/docs/app/building-your-application/deploying/static-exports
  output: "export",
};

export default nextConfig;
