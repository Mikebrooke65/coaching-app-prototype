import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import type { User, UserProfile, UserTeam, Team } from '../types/database';

interface AuthState {
  user: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Fetch user profile with team assignments
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      // Fetch user details
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      // Fetch user teams with team details
      const { data: userTeams, error: teamsError } = await supabase
        .from('user_teams')
        .select(`
          *,
          team:teams(*)
        `)
        .eq('user_id', userId);

      if (teamsError) throw teamsError;

      // Find default team
      const defaultTeam = userTeams?.find((ut) => ut.is_default)?.team;

      return {
        ...userData,
        teams: userTeams || [],
        defaultTeam,
      } as UserProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    let mounted = true;
    
    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (mounted) {
        console.warn('Auth initialization timeout - setting loading to false');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    }, 5000);

    // Check active session
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (!mounted) return;
        
        clearTimeout(timeout);
        
        if (error) {
          console.error('Error getting session:', error);
          setState({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return;
        }
        
        if (session?.user) {
          fetchUserProfile(session.user.id).then((profile) => {
            if (!mounted) return;
            setState({
              user: profile,
              session,
              isAuthenticated: !!profile,
              isLoading: false,
            });
          });
        } else {
          setState({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      })
      .catch((error) => {
        if (!mounted) return;
        clearTimeout(timeout);
        console.error('Error initializing auth:', error);
        setState({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
        });
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setState({
          user: profile,
          session,
          isAuthenticated: !!profile,
          isLoading: false,
        });
      } else if (event === 'SIGNED_OUT') {
        setState({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    console.log('Login function called with email:', email);
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      console.log('Calling Supabase signInWithPassword...');
      
      // Add timeout to prevent infinite hang
      const loginPromise = supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Login timeout - please try again')), 10000)
      );
      
      const { data, error } = await Promise.race([loginPromise, timeoutPromise]) as any;

      console.log('Supabase response:', { data, error });

      if (error) throw error;

      if (data.user) {
        console.log('User authenticated, fetching profile...');
        const profile = await fetchUserProfile(data.user.id);
        
        console.log('Profile fetched:', profile);
        
        // Update last login timestamp
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', data.user.id);

        console.log('Login successful!');
        setState({
          user: profile,
          session: data.session,
          isAuthenticated: !!profile,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setState({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
  };

  // Update profile function
  const updateProfile = async (updates: Partial<User>) => {
    if (!state.user) throw new Error('No user logged in');

    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', state.user.id);

    if (error) throw error;

    // Refresh user profile
    const profile = await fetchUserProfile(state.user.id);
    setState((prev) => ({ ...prev, user: profile }));
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
