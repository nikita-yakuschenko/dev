import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const markdownComponents: Components = {
  table: ({ children }) => (
    <div className="docs-table-wrap">
      <table>{children}</table>
    </div>
  ),
};

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="docs-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
