import type { ReactNode } from "react";

import { JsonLd } from "@/components/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  noIndex: true,
});

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Admin",
          robots: "noindex, nofollow",
        }}
      />
      {children}
    </>
  );
}
