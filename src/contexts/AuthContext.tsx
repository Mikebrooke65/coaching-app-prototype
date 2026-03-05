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
      console.log('Fetching user profile for:', userId);
      
      // Fetch user details with timeout
      const userPromise = supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('User fetch timeout')), 5000)
      );
      
      const { data: userData, error: userError } = await Promise.race([
        userPromise,
        timeoutPromise
      ]) as any;

      if (userError) {
        console.error('Error fetching user:', userError);
        throw userError;
      }

      console.log('User data fetched:', userData);

      // Fetch user teams with team details (with timeout)
      const teamsPromise = supabase
        .from('user_teams')
        .select(`
          *,
          team:teams(*)
        `)
        .eq('user_id', userId);
      
      const teamsTimeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Teams fetch timeout')), 5000)
      );
      
      const { data: userTeams, error: teamsError } = await Promise.race([
        teamsPromise,
        teamsTimeoutPromise
      ]) as any;

      if (teamsError) {
        console.warn('Error fetching teams (continuing anyway):', teamsError);
        // Don't throw - continue without teams
      }

      console.log('Teams fetched:', userTeams?.length || 0);

      // Find default team
      const defaultTeam = userTeams?.find((ut: any) => ut.is_default)?.team;

      const profile = {
        ...userData,
        teams: userTeams || [],
        defaultTeam,
      } as UserProfile;
      
      console.log('Profile complete:', profile);
      return profile;
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
        console.warn('Auth initialization timeout - attempting recovery from localStorage');
        
        // Try to recover session from localStorage
        const storageKey = `sb-pikrxkxpizdezazlwxhb-auth-token`;
        const storedSession = localStorage.getItem(storageKey);
        
        console.log('Stored session exists:', !!storedSession);
        
        if (storedSession) {
          try {
            const sessionData = JSON.parse(storedSession);
            console.log('Parsed session data:', { 
              hasAccessToken: !!sessionData?.access_token,
              hasRefreshToken: !!sessionData?.refresh_token,
              hasUser: !!sessionData?.user 
            });
            
            if (sessionData?.access_token && sessionData?.refresh_token) {
              console.log('Attempting to restore session...');
              // Set the session manually
              supabase.auth.setSession({
                access_token: sessionData.access_token,
                refresh_token: sessionData.refresh_token,
              }).then(({ data, error }) => {
                console.log('setSession result:', { hasData: !!data, hasError: !!error });
                
                if (!error && data.user) {
                  console.log('Session restored successfully, fetching profile...');
                  fetchUserProfile(data.user.id).then((profile) => {
                    if (mounted) {
                      console.log('Profile fetched, setting authenticated state');
                      setState({
                        user: profile,
                        session: data.session,
                        isAuthenticated: !!profile,
                        isLoading: false,
                      });
                    }
                  });
                } else {
                  console.error('Failed to restore session:', error);
                  setState(prev => ({ ...prev, isLoading: false }));
                }
              }).catch((err) => {
                console.error('setSession error:', err);
                setState(prev => ({ ...prev, isLoading: false }));
              });
              return;
            } else {
              console.warn('Session data missing required fields');
            }
          } catch (e) {
            console.error('Failed to parse stored session:', e);
          }
        } else {
          console.log('No stored session found');
        }
        
        setState(prev => ({ ...prev, isLoading: false }));
      }
    }, 3000); // Reduced to 3 seconds

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
      console.log('Supabase client exists:', !!supabase);
      console.log('Supabase auth exists:', !!supabase.auth);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Supabase response received:', { hasData: !!data, hasError: !!error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

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
