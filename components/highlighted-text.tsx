import { cn } from "@/lib/utils";
import type { TextPart } from "@/lib/docs/search";

export function HighlightedText({
  parts,
  className,
}: {
  parts: TextPart[];
  className?: string;
}) {
  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.highlight ? (
          <mark
            key={`${part.text}-${index}`}
            className={cn(
              "rounded-sm bg-primary/15 px-0.5 text-foreground",
              "not-italic",
            )}
          >
            {part.text}
          </mark>
        ) : (
          <span key={`${part.text}-${index}`}>{part.text}</span>
        ),
      )}
    </span>
  );
}
