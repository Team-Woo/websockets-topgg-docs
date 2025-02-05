import { readEvalMDX } from "@/lib/docsHelpers";

import SelectPlatform from "./[platform]/select-platform";
import React from "react";
import OnThisPage from "../components/onThisPage";

async function Doc() {
  const mcxContent = await readEvalMDX("/docs/index.mdx");
  const content = mcxContent.default({});

  return (
    <>
      <aside className="p-4 min-w-[256px]">
        <h3>Libraries & Advanced</h3>
        <SelectPlatform />
      </aside>
      <article className="markdown p-4 lg:w-1/2 max-w-6xl">{content}</article>
      <aside className="p-4 w-80">
        <OnThisPage content={content} />
      </aside>
    </>
  );
}

export default Doc;
