import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Never Build Alone: Worldforge",
  description:
    "A social open-world action-adventure — vertical slice build.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
