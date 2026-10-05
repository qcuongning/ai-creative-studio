import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Xưởng AI — Ảnh, video và giọng nói",
  description: "Sáng tạo ảnh, video và giọng nói với API Thực Chiến AI.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">{children}</body>
    </html>
  );
}
