import { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const initAuth = useAppStore((state) => state.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
