import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google"; // 1. Import Inter
import "./globals.css";
import AuthProvider from "./providers/provider";

// 2. Configure the Inter font
const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TravelSync",
  description: "Explore India with TravelSync",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#5b21b6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* 3. Apply the inter class name */}
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}