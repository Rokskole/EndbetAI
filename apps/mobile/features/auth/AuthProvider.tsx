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
      // Check for existing session in Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Get user data from our API
        try {
          const response = await apiClient.getCurrentUser();
          if (response.success && response.data) {
            setUser(response.data);
            // Session ID is managed by ApiClient, not returned in response
            // If we have a valid user, the session is active
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          // If API call fails, still set basic user from Supabase
          // Create a minimal User object from Supabase session
          const basicUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            display_name: session.user.user_metadata?.name || 'User',
            created_at: session.user.created_at || new Date().toISOString(),
            updated_at: session.user.updated_at || new Date().toISOString(),
          };
          setUser(basicUser);
        }
      } else {
        setUser(null);
        setSessionId(null);
        apiClient.setSessionId(null);
      }
    } catch (error) {
      console.error('Failed to check session:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Send magic link via API
      const response = await apiClient.sendMagicLink(email);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to send magic link');
      }
      
      // Magic link sent - user will click link in email
      // The callback will handle the actual authentication
      // Function returns void, success is indicated by no error being thrown
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
