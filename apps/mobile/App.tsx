import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { Provider as PaperProvider, MD3DarkTheme } from 'react-native-paper';

// Simple dark theme
const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#22c55e',
    onPrimary: '#000000',
    secondary: '#34d399',
    onSecondary: '#000000',
    surface: '#1f2937',
    onSurface: '#f9fafb',
    background: '#111827',
    onBackground: '#f9fafb',
    error: '#dc2626',
    onError: '#ffffff',
  },
};

function CrisisSupportScreen() {
  const callEmergency = () => {
    Alert.alert('Emergency', 'Calling 911...');
  };

  const callSuicidePrevention = () => {
    Alert.alert('Suicide Prevention', 'Calling 988...');
  };

  const textCrisis = () => {
    Alert.alert('Crisis Text', 'Texting HOME to 741741...');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🚨 Crisis Support</Text>
        <Text style={styles.subtitle}>You are not alone. Help is available right now.</Text>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Immediate Help</Text>
            <Text style={styles.cardText}>
              If you're in immediate danger or having thoughts of self-harm, please reach out now:
            </Text>
            
            <View style={styles.buttonContainer}>
              <Button 
                mode="contained" 
                style={[styles.emergencyButton, { backgroundColor: '#22c55e' }]}
                onPress={callSuicidePrevention}
                textColor="#000000"
              >
                Call 988 (Suicide Prevention)
              </Button>

              <Button 
                mode="contained" 
                style={[styles.emergencyButton, { backgroundColor: '#dc2626' }]}
                onPress={callEmergency}
                textColor="#ffffff"
              >
                Call 911 (Emergency)
              </Button>

              <Button 
                mode="contained" 
                style={[styles.emergencyButton, { backgroundColor: '#34d399' }]}
                onPress={textCrisis}
                textColor="#000000"
              >
                Text HOME to 741741
              </Button>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>🧘 Grounding Exercise</Text>
            <Text style={styles.cardText}>
              If you're feeling overwhelmed, try this 5-4-3-2-1 technique:
            </Text>
            
            <View style={styles.exerciseSteps}>
              <Text style={styles.stepText}>5 things you can see</Text>
              <Text style={styles.stepText}>4 things you can touch</Text>
              <Text style={styles.stepText}>3 things you can hear</Text>
              <Text style={styles.stepText}>2 things you can smell</Text>
              <Text style={styles.stepText}>1 thing you can taste</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>💙 Remember</Text>
            <Text style={styles.supportText}>• You are not alone in this moment</Text>
            <Text style={styles.supportText}>• These feelings are temporary</Text>
            <Text style={styles.supportText}>• You are worthy of help and support</Text>
            <Text style={styles.supportText}>• There are people who care about you</Text>
            <Text style={styles.supportText}>• This crisis will pass</Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

function MainScreen() {
  const [showCrisis, setShowCrisis] = React.useState(false);

  if (showCrisis) {
    return <CrisisSupportScreen />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>QuitBet AI</Text>
        <Text style={styles.subtitle}>Your compassionate companion for gambling recovery</Text>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>If you're in crisis right now</Text>
            <Text style={styles.cardText}>
              Please reach out for immediate help. You're not alone.
            </Text>
            <Button 
              mode="contained" 
              style={styles.sosButton}
              onPress={() => setShowCrisis(true)}
            >
              Get Help Now
            </Button>
          </Card.Content>
        </Card>

        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            style={styles.primaryButton}
            onPress={() => Alert.alert('Sign In', 'Sign in functionality would go here')}
          >
            Sign In with Email
          </Button>
          
          <Button 
            mode="outlined" 
            style={styles.secondaryButton}
            onPress={() => Alert.alert('Create Account', 'Create account functionality would go here')}
          >
            Create Account
          </Button>
        </View>

        <Text style={styles.disclaimer}>
          AI is not a substitute for professional therapy. 
          If you're in crisis, please contact emergency services.
        </Text>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <PaperProvider theme={darkTheme}>
      <MainScreen />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827', // Very dark background
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#22c55e', // Green
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#9ca3af', // Light gray
    textAlign: 'center',
    marginBottom: 32,
  },
  card: {
    marginBottom: 24,
    backgroundColor: '#1f2937', // Dark gray
    borderColor: '#4b5563',
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f9fafb', // Light text
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    color: '#d1d5db', // Light gray text
    marginBottom: 16,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 16,
  },
  emergencyButton: {
    marginBottom: 8,
  },
  sosButton: {
    backgroundColor: '#dc2626', // Red
  },
  primaryButton: {
    backgroundColor: '#22c55e', // Green
  },
  secondaryButton: {
    borderColor: '#22c55e', // Green border
  },
  exerciseSteps: {
    marginTop: 12,
  },
  stepText: {
    fontSize: 16,
    color: '#f9fafb',
    marginBottom: 8,
    paddingLeft: 20,
  },
  supportText: {
    fontSize: 16,
    color: '#d1d5db',
    marginBottom: 8,
  },
  disclaimer: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 24,
  },
});
