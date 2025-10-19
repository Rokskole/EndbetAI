import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@packages/types';
import { supabase } from '@/lib/supabase';
import { apiClient } from '@/lib/apiClient';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  sessionId: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    checkSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Get user data from our database
          try {
            const response = await fetch('/api/users/profile', {
              headers: {
                'Authorization': `Bearer ${session.access_token}`,
              },
            });
            
            if (response.ok) {
              const userData = await response.json();
              setUser(userData.data);
            }
          } catch (error) {
            console.error('Failed to fetch user data:', error);
          }
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkSession = async () => {
    try {
      // Don't auto-login for demo - always show login page
      setUser(null);
    } catch (error) {
      console.error('Failed to check session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string) => {
    setIsLoading(true);
    try {
      // Simulate successful login for demo
      const user = {
        id: 'user123',
        email: email,
        name: 'User'
      };
      
      setUser(user);
      setSessionId('mock_session');
      apiClient.setSessionId('mock_session');
      
      // Return success
      return { success: true, user };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      // Logout from our API
      if (sessionId) {
        await apiClient.logout();
      }
      
      // Also logout from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSessionId(null);
      apiClient.setSessionId(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut, sessionId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
