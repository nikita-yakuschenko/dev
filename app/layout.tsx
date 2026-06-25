import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import { JsonLd } from "@/components/json-ld";
import { rootMetadata } from "@/lib/seo/metadata";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo/site";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-avgst",
  display: "swap",
});

export const metadata: Metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${manrope.variable} font-sans`}>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
            description: SITE_DESCRIPTION,
            inLanguage: "ru-RU",
            publisher: {
              "@type": "Organization",
              name: "AVGST",
              url: SITE_URL,
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
