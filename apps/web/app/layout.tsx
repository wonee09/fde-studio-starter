import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "숨 스튜디오",
  description: "필라테스 스튜디오 숨의 예약 웹앱",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
