import type { NextConfig } from "next";

const RESUME = "/ruixuan-xu-resume.pdf";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // A short link to hand out — /resume is short enough to say aloud or put
      // on an application. Temporary rather than permanent so the file can be
      // renamed later without browsers holding on to a cached hop.
      { source: "/resume", destination: RESUME, permanent: false },
      { source: "/resume.pdf", destination: RESUME, permanent: false },
    ];
  },
};

export default nextConfig;
