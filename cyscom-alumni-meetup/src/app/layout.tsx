// =============================================================================
// Root layout — global styles + fonts. Single-page site, so this is all we need.
// =============================================================================
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { EVENT_CONFIG } from "@/config/event";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: `${EVENT_CONFIG.name} — Free Alumni Event`,
  description: EVENT_CONFIG.description,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased bg-bg text-text`}>
        {children}
      </body>
    </html>
  );
}
