import type { NextConfig } from "next";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isGithubPagesBuild = process.env.GITHUB_ACTIONS === "true";
const useStaticExport = process.env.NEXT_PUBLIC_USE_STATIC_EXPORT === "true";
const isUserOrOrgPagesSite = repositoryName.endsWith(".github.io");
const githubPagesBasePath =
  useStaticExport && isGithubPagesBuild && repositoryName && !isUserOrOrgPagesSite
    ? `/${repositoryName}`
    : "";

const nextConfig: NextConfig = {
  ...(useStaticExport ? { output: "export" as const } : {}),
  reactStrictMode: true,
  images: {
    unoptimized: useStaticExport,
  },
  basePath: githubPagesBasePath,
  assetPrefix: githubPagesBasePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: githubPagesBasePath,
  },
};

export default nextConfig;
