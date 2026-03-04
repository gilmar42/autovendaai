"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// List of routes that don't require authentication
const publicRoutes = ['/', '/login', '/register', '/about', '/pricing'];

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/_next') || pathname.startsWith('/api/');
      
      if (!isAuthenticated && !isPublicRoute) {
        // Redirect to login, saving the attempted URL
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      }
      
      // Auto-redirect authenticated users away from auth pages
      if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-muted-foreground animate-pulse">Carregando VendAI...</p>
        </div>
      </div>
    );
  }

  // Handle unauthenticated state trying to load a protected route (avoid flashing content)
  const isPublicRoute = publicRoutes.includes(pathname);
  if (!isAuthenticated && !isPublicRoute) {
    return null; // Will be redirected in the useEffect
  }

  // Render children
  return <>{children}</>;
}
