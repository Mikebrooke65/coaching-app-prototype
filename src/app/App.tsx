import { useState } from 'react';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router';
import { LoginScreen } from './components/LoginScreen';
import { createRouter } from './routes';

export type UserRole = 'coach' | 'manager' | 'admin' | 'player' | 'caregiver';

export interface UserTeamRole {
  role: UserRole;
  teamName: string;
}

export interface User {
  email: string;
  name: string;
  role: UserRole;
  teamName: string;
  roles?: UserTeamRole[]; // Multiple role assignments
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  if (!isAuthenticated || !currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const router = createRouter(currentUser, handleLogout);

  // Redirect admins to desktop version
  if (currentUser.role === 'admin' && window.location.pathname === '/') {
    window.location.pathname = '/desktop';
  }

  return <RouterProvider router={router} />;
}