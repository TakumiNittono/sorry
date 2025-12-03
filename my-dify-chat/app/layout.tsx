import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NITTONO社専用謝罪AIツール",
  description: "NITTONO社専用の謝罪AIツール",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
