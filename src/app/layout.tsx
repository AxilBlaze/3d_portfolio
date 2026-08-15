import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CursorShine from "./components/CursorShine";
import KlausWidget from "./components/KlausWidget";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Portfolio - Modern Software Development",
  description: "Build and launch enterprise-grade Software with AI and Humans",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${inter.className} scroll-pattern`}>
        <CursorShine />
        {children}
        {/* Klaus assistant widget (client-only) */}
        <KlausWidget />
      </body>
    </html>
  );
}
