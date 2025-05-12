import { Navigate, Outlet, useLocation } from 'react-router';

import { type AuthState, useAuthStore } from '#src/stores/auth-store';

export function ProtectedRoute() {
  const user = useAuthStore((s: AuthState) => s.user);
  const here = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: here }} replace />;
  }

  return <Outlet />;
}
