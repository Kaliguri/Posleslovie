import type { NextConfig } from "next";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isGithubPagesBuild = process.env.GITHUB_ACTIONS === "true";
const isUserOrOrgPagesSite = repositoryName.endsWith(".github.io");
const githubPagesBasePath =
  isGithubPagesBuild && repositoryName && !isUserOrOrgPagesSite
    ? `/${repositoryName}`
    : "";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  basePath: githubPagesBasePath,
  assetPrefix: githubPagesBasePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: githubPagesBasePath,
  },
};

export default nextConfig;
