import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chat Application",
  description: "Chat interface",
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
