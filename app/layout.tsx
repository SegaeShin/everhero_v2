import type { Metadata } from "next";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

import "./globals.css";

export const metadata: Metadata = {
  title: "EverHero",
  description: "기업 퇴직연금 관리 플랫폼"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">
        <div className="flex min-h-screen flex-col md:flex-row">
          <Sidebar />
          <div className="flex min-h-screen min-w-0 flex-1 flex-col">
            <Header />
            <main className="flex-1 px-6 py-6 md:px-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
