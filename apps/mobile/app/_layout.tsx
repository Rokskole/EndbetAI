import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { Appearance } from 'react-native';

import { theme } from '@/styles/theme';
import { AuthProvider } from '@/features/auth/AuthProvider';

// Force dark theme
const FORCE_DARK_THEME = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#60a5fa',
    onPrimary: '#000000',
    primaryContainer: '#1e3a8a',
    onPrimaryContainer: '#dbeafe',
    secondary: '#34d399',
    onSecondary: '#000000',
    secondaryContainer: '#059669',
    onSecondaryContainer: '#d1fae5',
    tertiary: '#a78bfa',
    onTertiary: '#000000',
    tertiaryContainer: '#7c3aed',
    onTertiaryContainer: '#ede9fe',
    surface: '#1f2937',
    onSurface: '#f9fafb',
    surfaceVariant: '#374151',
    onSurfaceVariant: '#d1d5db',
    background: '#111827',
    onBackground: '#f9fafb',
    error: '#f87171',
    onError: '#000000',
    errorContainer: '#dc2626',
    onErrorContainer: '#fef2f2',
    outline: '#4b5563',
    outlineVariant: '#6b7280',
    surfaceDisabled: '#374151',
    onSurfaceDisabled: '#6b7280',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#f9fafb',
    inversePrimary: '#3b82f6',
  },
  roundness: 12,
};

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default function RootLayout() {
  useEffect(() => {
    // Force dark mode
    Appearance.setColorScheme('dark');
    
    // Hide splash screen after app is ready
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <PaperProvider theme={FORCE_DARK_THEME}>
          <AuthProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { 
                  backgroundColor: '#111827',
                },
                animation: 'slide_from_right',
              }}
            >
              <Stack.Screen 
                name="index" 
                options={{
                  contentStyle: { backgroundColor: '#111827' },
                }}
              />
              <Stack.Screen 
                name="auth" 
                options={{
                  contentStyle: { backgroundColor: '#111827' },
                }}
              />
              <Stack.Screen 
                name="onboarding" 
                options={{
                  contentStyle: { backgroundColor: '#111827' },
                }}
              />
              <Stack.Screen 
                name="(tabs)" 
                options={{
                  contentStyle: { backgroundColor: '#111827' },
                }}
              />
              <Stack.Screen 
                name="sos" 
                options={{
                  contentStyle: { backgroundColor: '#111827' },
                }}
              />
              <Stack.Screen 
                name="crisis-support" 
                options={{
                  contentStyle: { backgroundColor: '#111827' },
                }}
              />
              <Stack.Screen 
                name="grounding-exercise" 
                options={{
                  contentStyle: { backgroundColor: '#111827' },
                }}
              />
              <Stack.Screen 
                name="finance/add" 
                options={{
                  contentStyle: { backgroundColor: '#111827' },
                }}
              />
              <Stack.Screen 
                name="journal/add" 
                options={{
                  contentStyle: { backgroundColor: '#111827' },
                }}
              />
              <Stack.Screen 
                name="test-theme" 
                options={{
                  contentStyle: { backgroundColor: '#111827' },
                }}
              />
              <Stack.Screen 
                name="dark-test" 
                options={{
                  contentStyle: { backgroundColor: '#111827' },
                }}
              />
              <Stack.Screen 
                name="crisis-dark" 
                options={{
                  contentStyle: { backgroundColor: '#111827' },
                }}
              />
              <Stack.Screen 
                name="simple-dark" 
                options={{
                  contentStyle: { backgroundColor: '#111827' },
                }}
              />
            </Stack>
            <StatusBar style="light" backgroundColor="#111827" />
          </AuthProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
