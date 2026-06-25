import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-avgst",
  display: "swap",
});

export const metadata: Metadata = {
  title: "dev.avgst",
  description: "Корпоративный портал разработчика AVGST.",
  metadataBase: new URL("https://dev.avgst.ru"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${manrope.variable} font-sans`}>{children}</body>
    </html>
  );
}
