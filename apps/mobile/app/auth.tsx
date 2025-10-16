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
      await signIn(data.email);
      setEmailSent(true);
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
        <Text variant="headlineLarge" style={styles.title}>
          Sign In
        </Text>
        
        <Text variant="bodyLarge" style={styles.subtitle}>
          Enter your email address to receive a magic link
        </Text>

        <Card style={styles.card}>
          <Card.Content>
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
            >
              Send Magic Link
            </Button>
          </Card.Content>
        </Card>

        <Text variant="bodySmall" style={styles.disclaimer}>
          By signing in, you agree to our Terms of Service and Privacy Policy.
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
});
