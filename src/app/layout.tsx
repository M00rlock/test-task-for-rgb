import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "RGB CRM",
  description: "CRM MVP for clients and deals built with Next.js, Tailwind, NestJS, and Prisma."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className="min-h-screen bg-background text-foreground">{children}</body>
    </html>
  );
}
