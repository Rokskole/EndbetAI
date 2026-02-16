import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { PremiumProvider } from '@/features/premium/PremiumProvider';

const FORCE_DARK_THEME = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    background: '#111827',
    surface: '#1f2937',
    onSurface: '#f9fafb',
    primary: '#22c55e',
  },
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={FORCE_DARK_THEME}>
        <AuthProvider>
          <PremiumProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#111827' },
              }}
            />
            <StatusBar style="light" backgroundColor="#111827" />
          </PremiumProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

