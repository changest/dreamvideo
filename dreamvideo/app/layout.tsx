import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DreamVideo - 文生视频",
  description: "支持自定义API接入的文生视频生成平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased min-h-screen bg-[#F5F6F7]">
        {children}
      </body>
    </html>
  );
}
