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
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased pt-24 text-foreground bg-background`}>
        <AuthProvider>
          <ProtectedRoute>
            <ErrorBoundary>
              <Navbar />
              {children}
              <AIChatFloating />
            </ErrorBoundary>
          </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  );
}
