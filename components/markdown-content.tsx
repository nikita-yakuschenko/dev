import { MarkdownWithCopy } from "@/components/markdown-with-copy";

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="docs-content">
      <MarkdownWithCopy content={content} />
    </div>
  );
}
