"use client";

import Giscus from "@giscus/react";

export default function Comments() {
  return (
    <div className="w-full mt-10 p-6 bg-[var(--card-bg)] shadow-sm border border-[var(--border)]">
      <Giscus
        id="comments"
        repo="MarcoAgostinoo/buildebyte-comentarios"
        repoId="R_kgDORFSvmg"
        category="Announcements"
        categoryId="DIC_kwDORFSvms4C1q8b"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme="preferred_color_scheme"
        lang="pt"
        loading="lazy"
      />
    </div>
  );
}
