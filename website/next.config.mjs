/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cfwppxjifppdymsvmkhy.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/posts/**",
      },
    ],
  },
};

export default nextConfig;
