"use client";

import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { CopyCodeBlock } from "@/components/copy-code-block";

const markdownComponents: Components = {
  table: ({ children }) => (
    <div className="docs-table-wrap">
      <table>{children}</table>
    </div>
  ),
  pre: ({ children, className, ...props }) => (
    <CopyCodeBlock className={className} {...props}>
      {children}
    </CopyCodeBlock>
  ),
};

export function MarkdownWithCopy({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {content}
    </ReactMarkdown>
  );
}
