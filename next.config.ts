import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        authInterrupts: true,
    },
    images : {
        remotePatterns : [
            {
                hostname : "*",
            }
        ]
    }
};

export default nextConfig;
