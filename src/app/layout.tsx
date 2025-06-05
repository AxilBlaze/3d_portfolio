import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CursorShine from "./components/CursorShine";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portfolio - Modern Software Development",
  description: "Build and launch enterprise-grade Software with AI and Humans",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CursorShine />
        {children}
      </body>
    </html>
  );
}
