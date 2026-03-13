import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/database';
import type { TeamRole } from '../types/database';

export function usePermissions() {
  const { user } = useAuth();

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const isAdmin = hasRole(UserRole.ADMIN);
  const isManager = hasRole(UserRole.MANAGER);
  const isCoach = hasRole(UserRole.COACH);
  const isPlayer = hasRole(UserRole.PLAYER);
  const isCaregiver = hasRole(UserRole.CAREGIVER);

  // Combined permission checks (app-level)
  const canManageContent = hasRole([UserRole.ADMIN]);
  const canManageUsers = hasRole([UserRole.ADMIN]);
  const canManageTeams = hasRole([UserRole.ADMIN]);
  const canCoach = hasRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.COACH]);
  const canViewReports = hasRole([UserRole.ADMIN, UserRole.MANAGER]);
  const canCreateDeliveries = hasRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.COACH]);
  const canProvideFeedback = hasRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.COACH]);

  // Full version vs lite version (app-level navigation)
  const hasFullVersion = hasRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.COACH]);
  const hasLiteVersion = hasRole([UserRole.PLAYER, UserRole.CAREGIVER]);

  // Team-level permission checks (based on Team_Role, independent of App_Role)
  const getTeamRole = (teamId: string): TeamRole | null => {
    const membership = user?.teamMemberships?.find(tm => tm.team_id === teamId);
    return membership?.role ?? null;
  };

  const canManageTeamRoster = (teamId: string): boolean => {
    if (isAdmin) return true;
    const role = getTeamRole(teamId);
    return role === 'coach' || role === 'manager';
  };

  const canCreateTeamEvents = (teamId: string): boolean => {
    if (isAdmin) return true;
    const role = getTeamRole(teamId);
    return role === 'coach' || role === 'manager';
  };

  const canSendTeamMessages = (teamId: string): boolean => {
    if (isAdmin) return true;
    const role = getTeamRole(teamId);
    return role === 'coach' || role === 'manager';
  };

  return {
    user,
    hasRole,
    isAdmin,
    isManager,
    isCoach,
    isPlayer,
    isCaregiver,
    canManageContent,
    canManageUsers,
    canManageTeams,
    canCoach,
    canViewReports,
    canCreateDeliveries,
    canProvideFeedback,
    hasFullVersion,
    hasLiteVersion,
    // Team-level
    getTeamRole,
    canManageTeamRoster,
    canCreateTeamEvents,
    canSendTeamMessages,
  };
}
