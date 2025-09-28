import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        authInterrupts: true,
        useCache : true
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
