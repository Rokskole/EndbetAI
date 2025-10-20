import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Card, HelperText } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'expo-router';
import { useAuth } from '@/features/auth/AuthProvider';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type EmailForm = z.infer<typeof emailSchema>;

export default function AuthScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = async (data: EmailForm) => {
    setIsLoading(true);
    try {
      // Simulate successful login
      await signIn(data.email);
      
      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="headlineSmall" style={styles.title}>
                Check Your Email
              </Text>
              
              <Text variant="bodyLarge" style={styles.message}>
                We've sent you a magic link to sign in. Please check your email and click the link to continue.
              </Text>
              
              <Button 
                mode="outlined" 
                style={styles.button}
                onPress={() => setEmailSent(false)}
              >
                Try Different Email
              </Button>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>🎯</Text>
          </View>
          <Text variant="headlineLarge" style={styles.title}>
            QuitBet AI
          </Text>
          
          <Text variant="bodyLarge" style={styles.subtitle}>
            Your compassionate companion for gambling recovery
          </Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>
              Welcome Back
            </Text>
            <Text variant="bodyMedium" style={styles.cardSubtitle}>
              Enter your email to continue your recovery journey
            </Text>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextInput
                    label="Email Address"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    style={styles.input}
                    error={!!errors.email}
                    mode="outlined"
                    theme={{
                      colors: {
                        primary: '#60a5fa',
                        onSurface: '#f9fafb',
                        surface: '#374151',
                        outline: '#4b5563'
                      }
                    }}
                  />
                  {errors.email && (
                    <HelperText type="error" visible={!!errors.email}>
                      {errors.email.message}
                    </HelperText>
                  )}
                </View>
              )}
            />

            <Button 
              mode="contained" 
              style={styles.button}
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              disabled={isLoading}
              labelStyle={styles.buttonLabel}
            >
              {isLoading ? 'Signing In...' : 'Continue Journey'}
            </Button>
          </Card.Content>
        </Card>

        <View style={styles.features}>
          <Text variant="titleSmall" style={styles.featuresTitle}>
            Your Recovery Toolkit
          </Text>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>💬</Text>
            <Text variant="bodySmall" style={styles.featureText}>AI-powered chat support</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📊</Text>
            <Text variant="bodySmall" style={styles.featureText}>Progress tracking & insights</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🆘</Text>
            <Text variant="bodySmall" style={styles.featureText}>24/7 crisis support</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📝</Text>
            <Text variant="bodySmall" style={styles.featureText}>Journal & reflection tools</Text>
          </View>
        </View>

        <View style={styles.crisisCard}>
          <Text variant="titleSmall" style={styles.crisisTitle}>
            Need Immediate Help?
          </Text>
          <Text variant="bodySmall" style={styles.crisisText}>
            If you're in crisis, please reach out for immediate support
          </Text>
          <Button 
            mode="outlined" 
            style={styles.crisisButton}
            onPress={() => router.push('/crisis-support')}
          >
            Get Help Now
          </Button>
        </View>

        <Text variant="bodySmall" style={styles.disclaimer}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827', // Dark background
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#60a5fa', // Light blue for dark theme
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    color: '#9ca3af', // Light gray for dark theme
  },
  card: {
    marginBottom: 32,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#60a5fa', // Light blue for dark theme
  },
  message: {
    marginBottom: 24,
    color: '#d1d5db', // Light gray text
  },
  disclaimer: {
    textAlign: 'center',
    color: '#9ca3af', // Light gray for dark theme
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  cardTitle: {
    color: '#f9fafb',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardSubtitle: {
    color: '#9ca3af',
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  features: {
    marginBottom: 32,
    padding: 20,
    backgroundColor: '#1f2937',
    borderRadius: 12,
  },
  featuresTitle: {
    color: '#f9fafb',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  featureText: {
    color: '#d1d5db',
    flex: 1,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1e3a8a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#60a5fa',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    fontSize: 40,
  },
  crisisCard: {
    marginBottom: 24,
    padding: 20,
    backgroundColor: '#dc2626',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f87171',
  },
  crisisTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  crisisText: {
    color: '#fecaca',
    marginBottom: 16,
    textAlign: 'center',
  },
  crisisButton: {
    borderColor: '#ffffff',
    borderWidth: 2,
  },
});
