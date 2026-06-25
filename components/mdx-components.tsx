import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";

export const mdxComponents: MDXComponents = {
  StatusBadge: ({ children }: { children: ReactNode }) => (
    <Badge className="mb-4 bg-primary/15 text-primary hover:bg-primary/20">
      {children}
    </Badge>
  ),
};
