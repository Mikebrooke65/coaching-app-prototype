import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import { useResponsive } from '../hooks/useResponsive';
import { UserRole } from '../types/database';

export function Landing() {
  const { user } = useAuth();
  const { hasFullVersion, hasLiteVersion } = usePermissions();
  const { isDesktop } = useResponsive();
  const navigate = useNavigate();

  console.log('Landing page rendering:', { user, hasFullVersion, hasLiteVersion, isDesktop });

  // Redirect admins to desktop interface if on desktop screen
  useEffect(() => {
    if (user?.role === UserRole.ADMIN && isDesktop) {
      console.log('Admin on desktop, redirecting to /desktop');
      navigate('/desktop', { replace: true });
    }
  }, [user, isDesktop, navigate]);

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.first_name}!
        </h1>
        <p className="text-gray-600">
          {hasFullVersion && 'Access your coaching tools and resources'}
          {hasLiteVersion && 'View your schedule and messages'}
        </p>
      </div>

      {/* Quick stats or announcements will go here */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Quick Access</h2>
          <p className="text-gray-600 text-sm">
            Your dashboard content will appear here
          </p>
        </div>
      </div>
    </div>
  );
}
