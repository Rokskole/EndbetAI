import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '@/features/auth/AuthProvider';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    handleAuthCallback();
  }, []);

  const handleAuthCallback = async () => {
    try {
      setStatus('loading');
      
      // Get the URL parameters from the deep link
      const url = new URL(window.location.href);
      const tokenHash = url.searchParams.get('token_hash');
      const type = url.searchParams.get('type');
      const email = url.searchParams.get('email');

      if (!tokenHash || !type || !email) {
        throw new Error('Missing authentication parameters');
      }

      // Verify the magic link with Supabase
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: type as any,
      });

      if (error || !data.user) {
        throw new Error('Invalid or expired authentication link');
      }

      // The AuthProvider will handle the rest through the auth state change listener
      setStatus('success');
      
      // Redirect to main app after a short delay
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 2000);

    } catch (error) {
      console.error('Auth callback error:', error);
      setError(error instanceof Error ? error.message : 'Authentication failed');
      setStatus('error');
    }
  };

  const handleRetry = () => {
    router.replace('/auth');
  };

  if (status === 'loading') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#14532d" />
        <Text variant="headlineSmall" style={styles.title}>
          Verifying your email...
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Please wait while we complete your sign-in.
        </Text>
      </View>
    );
  }

  if (status === 'success') {
    return (
      <View style={styles.container}>
        <Text variant="headlineSmall" style={styles.title}>
          Welcome to QuitBet AI!
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Your email has been verified. Redirecting to the app...
        </Text>
        <ActivityIndicator size="small" color="#14532d" style={styles.loader} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>
        Authentication Failed
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        {error || 'Something went wrong during authentication.'}
      </Text>
      <Button 
        mode="contained" 
        style={styles.button}
        onPress={handleRetry}
      >
        Try Again
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f8fafc',
  },
  title: {
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
    color: '#14532d',
  },
  subtitle: {
    textAlign: 'center',
    color: '#64748b',
    marginBottom: 24,
  },
  loader: {
    marginTop: 16,
  },
  button: {
    backgroundColor: '#14532d',
  },
});
