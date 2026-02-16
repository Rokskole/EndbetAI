import React from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function CrisisDarkScreen() {
  const router = useRouter();

  const callEmergency = () => {
    Linking.openURL('tel:911');
  };

  const callSuicidePrevention = () => {
    Linking.openURL('tel:988');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Crisis Support Header */}
        <View style={styles.crisisHeader}>
          <Text variant="headlineLarge" style={styles.crisisTitle}>
            🚨 Crisis Support
          </Text>
          <Text variant="bodyLarge" style={styles.crisisSubtitle}>
            You are not alone. Help is available right now.
          </Text>
        </View>

        {/* Emergency Buttons */}
        <Card style={styles.emergencyCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.emergencyTitle}>
              Immediate Help
            </Text>
            
            <Button
              mode="contained"
              style={styles.emergencyButton}
              onPress={callEmergency}
              icon="phone"
            >
              Call 911 (Emergency)
            </Button>
            
            <Button
              mode="contained"
              style={styles.suicideButton}
              onPress={callSuicidePrevention}
              icon="heart"
            >
              Call 988 (Suicide Prevention)
            </Button>
          </Card.Content>
        </Card>

        {/* Grounding Exercise */}
        <Card style={styles.groundingCard}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.groundingTitle}>
              🧘 Grounding Exercise
            </Text>
            <Text variant="bodyLarge" style={styles.groundingText}>
              Try this 5-4-3-2-1 technique:
            </Text>
            <Text variant="bodyMedium" style={styles.groundingStep}>
              <Text style={styles.stepNumber}>5</Text> things you can see
            </Text>
            <Text variant="bodyMedium" style={styles.groundingStep}>
              <Text style={styles.stepNumber}>4</Text> things you can touch
            </Text>
            <Text variant="bodyMedium" style={styles.groundingStep}>
              <Text style={styles.stepNumber}>3</Text> things you can hear
            </Text>
            <Text variant="bodyMedium" style={styles.groundingStep}>
              <Text style={styles.stepNumber}>2</Text> things you can smell
            </Text>
            <Text variant="bodyMedium" style={styles.groundingStep}>
              <Text style={styles.stepNumber}>1</Text> thing you can taste
            </Text>
          </Card.Content>
        </Card>

        {/* Back Button */}
        <Button
          mode="outlined"
          style={styles.backButton}
          onPress={() => router.back()}
          icon="arrow-left"
        >
          Back to Chat
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827', // Very dark background
  },
  content: {
    padding: 16,
  },
  crisisHeader: {
    backgroundColor: '#dc2626', // Red header
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  crisisTitle: {
    color: '#ffffff', // White text
    fontWeight: 'bold',
    marginBottom: 8,
  },
  crisisSubtitle: {
    color: '#fef2f2', // Light red text
    textAlign: 'center',
  },
  emergencyCard: {
    backgroundColor: '#1f2937', // Dark surface
    marginBottom: 20,
  },
  emergencyTitle: {
    color: '#f9fafb', // Light text
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emergencyButton: {
    backgroundColor: '#dc2626', // Red button
    marginBottom: 12,
  },
  suicideButton: {
    backgroundColor: '#22c55e', // Blue button
    marginBottom: 12,
  },
  groundingCard: {
    backgroundColor: '#1f2937', // Dark surface
    marginBottom: 20,
  },
  groundingTitle: {
    color: '#f9fafb', // Light text
    fontWeight: 'bold',
    marginBottom: 12,
  },
  groundingText: {
    color: '#f9fafb', // Light text
    marginBottom: 16,
  },
  groundingStep: {
    color: '#f9fafb', // Light text
    marginBottom: 8,
  },
  stepNumber: {
    fontWeight: 'bold',
    color: '#22c55e', // Blue accent
  },
  backButton: {
    borderColor: '#22c55e', // Blue border
    marginTop: 20,
  },
});
