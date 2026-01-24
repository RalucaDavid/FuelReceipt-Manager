"use client";

import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("@/components/navbar"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "100vh", backgroundColor: "#f8f9fa" }} />
  ),
});

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Navbar>{children}</Navbar>;
}
