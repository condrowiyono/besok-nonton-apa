import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const font = localFont({
  src: [
    {
      path: "../fonts/NetflixSans_W_Rg.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/NetflixSans_W_Md.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/NetflixSans_W_Bd.woff2",
      weight: "600",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "Besok Nonton Apa?",
  description: "Cari film yang mau kamu tonton besok",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  );
}
