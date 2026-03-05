import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/database';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireDesktop?: boolean;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  requireDesktop = false,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user role is allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Check desktop requirement for admin routes
  if (requireDesktop && user.role === UserRole.ADMIN) {
    const isDesktop = window.innerWidth >= 768;
    if (!isDesktop) {
      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">Desktop Required</h2>
            <p className="text-gray-600">
              Admin features are only available on desktop devices. Please access this page from a
              computer with a screen width of at least 768px.
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
