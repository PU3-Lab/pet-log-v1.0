import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pet Log",
  description: "AI-first pet care MVP for records, interpretation, and care suggestions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
