import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

const notoSans = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

const notoSerif = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["600", "700", "900"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "우리 반 홈페이지",
  description: "우리 반 학급 홈페이지입니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${notoSans.variable} ${notoSerif.variable}`}>
      <body className="font-body min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1 w-full max-w-5xl mx-auto px-5 py-10">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
