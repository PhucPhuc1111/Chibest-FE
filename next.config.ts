import type { NextConfig } from "next";

const apiRemotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] =
  [];

const appendRemotePattern = (
  protocol: "http" | "https",
  hostname: string,
  port?: string
) => {
  const exists = apiRemotePatterns.some(
    (pattern) =>
      pattern.protocol === protocol &&
      pattern.hostname === hostname &&
      (pattern.port ?? "") === (port ?? "")
  );

  if (!exists) {
    apiRemotePatterns.push({
      protocol,
      hostname,
      port,
      pathname: "/api/file/image",
    });
  }
};

if (process.env.NEXT_PUBLIC_API_BASE_URL) {
  try {
    const parsed = new URL(process.env.NEXT_PUBLIC_API_BASE_URL);
    const protocol = (parsed.protocol.replace(":", "") || "https") as
      | "http"
      | "https";

    appendRemotePattern(protocol, parsed.hostname, parsed.port || undefined);
  } catch (error) {
    console.warn(
      "[next.config] Failed to parse NEXT_PUBLIC_API_BASE_URL:",
      error
    );
  }
}

// Fallbacks for local development
appendRemotePattern("https", "localhost", "44334");
appendRemotePattern("http", "localhost", "44334");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: apiRemotePatterns,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
