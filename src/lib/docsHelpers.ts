"use server";
import path from "path";
import fs from "fs";

import { evaluate } from "@mdx-js/mdx";
import remarkGfm from 'remark-gfm'
import * as runtime from "react/jsx-runtime";

import { useMDXComponents } from "@/mdx-components";
import { MDXContent } from "mdx/types";

import rehypeStarryNight from 'rehype-starry-night'

type PageMeta = {
  author: string;
  title: string;
  description: string;
  keywords: string[];
};
export const getAllPages = async (params: { platform: string; version?: string }) => {
  let { version } = params
  const { platform } = params;



  if (!version) {
    const docsFolder = path.join(process.cwd(), "src", "docs", platform);
    const versionDirectories = fs
      .readdirSync(docsFolder, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    // Sort versions in descending order
    versionDirectories.sort((a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: "base" }));

    version = versionDirectories[0] as string;
  }

  const docsPath = path.join(process.cwd(), "src", "docs", platform, version);
  const files = fs.readdirSync(docsPath);

  // Sort files so that "index.mdx" is first and the rest are in numerical order
  files.sort((a, b) => {
    if (a === "index.mdx") return -1;
    if (b === "index.mdx") return 1;
    return a.localeCompare(b, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });

  const pages = files.map((file) => {
    return readEvalMDX(platform, version || "v0", file.replace(".mdx", ""));
  });
  return Promise.all(pages);
};

export const getDocContent = async (params: { platform: string; version?: string; page?: string }) => {
  let { version, page = "getting started" } = params;
  const { platform } = params;

  page = decodeURI(page).toLocaleLowerCase().replace(/-/g, " ");

  if (!version) {
    const docsFolder = path.join(process.cwd(), "src", "docs", platform);
    const versionDirectories = fs
      .readdirSync(docsFolder, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    // Sort versions in descending order
    versionDirectories.sort((a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: "base" }));

    version = versionDirectories[0];


  }

  const docsPath = path.join(process.cwd(), "src", "docs", platform, version);
  const files = fs.readdirSync(docsPath);

  const filesEvaluated = await Promise.all(
    files.map(async (file) => {
      const content = fs.readFileSync(path.join(docsPath, file), "utf8");
      return { mdx: await evaluateMDx(content), name: file };
    })
  );
  // Find the file that matches the title in the metadata
  const file = filesEvaluated.find((file) => {
    return file.mdx.meta.title.toLocaleLowerCase() === decodeURI(page).toLocaleLowerCase();
  });

  if (!file) {
    throw new Error(`Page not found: ${page}`);
  }

  return file.mdx.default({});
};

export function readEvalMDX(path: string): Promise<{
  meta: PageMeta;
  default: MDXContent;
}>;
export function readEvalMDX(
  platform: string,
  version: string,
  page: string
): Promise<{
  meta: PageMeta;
  default: MDXContent;
}>;
export async function readEvalMDX(platformOrPath: string, version?: string, page?: string) {
  let docPath;

  if (version && page) {
    docPath = path.join(process.cwd(), "src", "docs", platformOrPath, version, page + ".mdx");
  } else {
    docPath = path.join(process.cwd(), "src", platformOrPath);
  }
  const content = fs.readFileSync(docPath, "utf8");

  return evaluateMDx(content);
}

const evaluateMDx = (content: string) => {
  const data = evaluate(content, {
    ...runtime,
    baseUrl: import.meta.url,
    // @ts-expect-error type issues
    useMDXComponents: useMDXComponents,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeStarryNight]
  });

  return data as unknown as Promise<{ meta: PageMeta; default: MDXContent }>;
};

export const getDocsVersions = async (platform: string) => {
  const platformFolder = path.join(process.cwd(), "src", "docs", platform);

  // Check if the platform folder exists
  if (!fs.existsSync(platformFolder)) {
    throw new Error(`Platform "${platform}" does not exist.`);
  }

  const versionDirectories = fs
    .readdirSync(platformFolder, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  // Sort versions in descending order
  versionDirectories.sort((a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: "base" }));

  return versionDirectories;
};
/*
const getFilesInDirectory = (dir: string): string[] => {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFilesInDirectory(res) : res;
  });
  return Array.prototype.concat(...files);
};
*/

export const getDocsPages = async () => {
  const docsFolder = path.join(process.cwd(), "src", "docs");
  const directories = fs
    .readdirSync(docsFolder, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  let files: string[] = [];
  directories.forEach((directory) => {
    const folder = path.join(docsFolder, directory);
    const versionDirectories = fs
      .readdirSync(folder, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    // Sort versions in descending order
    versionDirectories.sort((a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: "base" }));

    const latestVersion = versionDirectories[0];
    const latestVersionFolder = path.join(folder, latestVersion);

    const filesInDirectory = fs.readdirSync(latestVersionFolder);
    const mdxFiles = filesInDirectory.filter((file) => file.endsWith(".mdx"));

    // Sort .mdx files in ascending order
    mdxFiles.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

    files = [...files, ...mdxFiles.map((file) => path.join(directory, latestVersion, file))];
  });

  return files;
};
