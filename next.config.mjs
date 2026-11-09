/** @type {import('next').NextConfig} */
export default function nextConfig(phase) {
  const development = phase === "phase-development-server";
  return {
    images: { unoptimized: true },
    allowedDevOrigins: ["192.168.31.21"],
    distDir: development ? ".next-dev" : ".next",
    ...(development || process.env.VERCEL === "1" ? {} : { output: "export" }),
  };
}
