import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VendAI - Plataforma IA Premium",
  description: "Sistema SaaS de vendas automáticas com agente de IA.",
};

import Navbar from "@/components/Navbar";
import AIChatFloating from "@/components/AIChatFloating";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased pt-24 text-foreground bg-background`}>
        <ErrorBoundary>
          <Navbar />
          {children}
          <AIChatFloating />
        </ErrorBoundary>
      </body>
    </html>
  );
}
