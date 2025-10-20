import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '@/features/auth/AuthProvider';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleSignIn = () => {
    console.log('Sign In clicked');
    router.push('/auth');
  };

  const handleCreateAccount = () => {
    console.log('Create Account clicked');
    router.push('/auth');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineLarge" style={styles.title}>
          Welcome to QuitBet AI
        </Text>
        
        <Text variant="bodyLarge" style={styles.subtitle}>
          Your compassionate companion for gambling recovery
        </Text>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>
              If you're in crisis right now
            </Text>
            <Text variant="bodyMedium" style={styles.cardText}>
              Please reach out for immediate help. You're not alone.
            </Text>
            <Button 
              mode="contained" 
              style={styles.sosButton}
              onPress={() => router.push('/crisis-support')}
            >
              Get Help Now
            </Button>
          </Card.Content>
        </Card>

        <View style={styles.buttons}>
          <Button 
            mode="contained" 
            style={styles.primaryButton}
            onPress={handleSignIn}
          >
            Sign In with Email
          </Button>
          
          <Button 
            mode="outlined" 
            style={styles.secondaryButton}
            onPress={handleCreateAccount}
          >
            Create Account
          </Button>
        </View>

        <Text variant="bodySmall" style={styles.disclaimer}>
          AI is not a substitute for professional therapy. 
          If you're in crisis, please contact emergency services.
        </Text>
      </View>
    </View>
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
    backgroundColor: '#374151', // Dark gray card
    borderColor: '#4b5563',
    borderWidth: 1,
  },
  cardTitle: {
    color: '#f87171', // Light red for dark theme
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardText: {
    color: '#fca5a5', // Light red text
    marginBottom: 16,
  },
  sosButton: {
    backgroundColor: '#dc2626',
  },
  buttons: {
    gap: 16,
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: '#60a5fa', // Light blue for dark theme
  },
  secondaryButton: {
    borderColor: '#60a5fa', // Light blue border for dark theme
  },
  disclaimer: {
    textAlign: 'center',
    color: '#9ca3af', // Light gray for dark theme
    fontStyle: 'italic',
  },
  loadingText: {
    color: '#60a5fa',
    fontSize: 18,
    textAlign: 'center',
  },
});
