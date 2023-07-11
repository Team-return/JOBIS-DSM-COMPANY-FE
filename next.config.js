/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    appDir: true,
    esmExternals: "loose",
  },
  compiler: {
    styledComponents: true,
  },
  formats: ["image/avif", "image/webp"],
  swcMinify: true, // 코드 경량화 작업에 Terser가 아닌 SWC를 사용합니다.
  images: {
    domains: ["jobis-file.s3.ap-northeast-2.amazonaws.com"],
  },
  output: "export",
};

module.exports = nextConfig;
