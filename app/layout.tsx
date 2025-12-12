import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A-Frame Click Demo",
  description: "Minimal scène A-Frame avec interactions multi-supports."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}

