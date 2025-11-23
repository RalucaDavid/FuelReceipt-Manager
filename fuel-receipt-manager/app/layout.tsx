import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fuel Receipt Manager",
  description: "Manage your fuel receipts with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
