import { RouterProvider } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { router } from './routes';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useResponsive } from './hooks/useResponsive';

function AppInitializer() {
  // Initialize hooks that need to run at app level
  useOnlineStatus();
  useResponsive();

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppInitializer />
    </AuthProvider>
  );
}
