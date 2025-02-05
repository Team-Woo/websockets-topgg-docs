import { getAllPages, getDocContent, getDocsVersions } from "@/lib/docsHelpers";
import SelectPlatform from "../select-platform";
import SelectVersion from "../select-version";
import Link from "next/link";
import React from "react";

import fs from "fs";
import path from "path";
import OnThisPage from "../../../components/onThisPage";


type Params = Promise<{ version: string, platform: string }>

async function Doc({ params }: { params: Params }) {
  const { platform, version } = await params;

  const content = await getDocContent({
    platform: platform,
    version: version,
  });

  const versions = await getDocsVersions(platform);

  const pages = await getAllPages({ platform, version });


  return (
    <>
      <aside className="p-4 w-60">
        <div className="w-full">
          <h3>Libraries & Advanced</h3>
          <SelectPlatform platform={platform} />
        </div>
        <div className="w-full">
          <h3>Version</h3>
          <SelectVersion platform={platform} versions={versions} version={version} />
        </div>

        <h2 className="text-lg font-bold mb-2">Pages</h2>
        <ul>
          {pages.map((pageItem, index) => (
            <li key={pageItem.meta.title} className={index === 0 ? "underline" : ""}>
              <Link
                href={`/${platform}/${version}/${pageItem.meta.title.toLocaleLowerCase().replace(/\s/g, "-")}`}
              >
                {pageItem.meta.title}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      <article className="markdown w-1/2 p-4">{content}</article>
      <aside className="p-4 w-80">
        <OnThisPage content={content} />
      </aside>
    </>
  );
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const docsDirectory = path.join(process.cwd(), "src", "docs");
  const platformDirectories = fs.readdirSync(docsDirectory).filter((platform) => {
    return fs.statSync(path.join(docsDirectory, platform)).isDirectory();
  });

  const params = [];

  for (const platform of platformDirectories) {
    const versionDirectories = fs.readdirSync(path.join(docsDirectory, platform)).filter((version) => {
      return fs.statSync(path.join(docsDirectory, platform, version)).isDirectory();
    });

    for (const version of versionDirectories) {
      params.push({
        platform,
        version,
      });
    }
  }

  return params;
}

export default Doc;
