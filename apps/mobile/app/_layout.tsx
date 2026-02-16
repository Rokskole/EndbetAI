import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { PremiumProvider } from '@/features/premium/PremiumProvider';
import { theme } from '../styles/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
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

