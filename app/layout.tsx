// next-js
import type { Metadata } from "next";
// style
import { Inter } from "next/font/google";
import "./globals.css";

// providers
import { ModalProvider } from "@/providers/modalProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard - Ecommerce Stores",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ModalProvider />
        <div>{children}</div>
      </body>
    </html>
  );
}
