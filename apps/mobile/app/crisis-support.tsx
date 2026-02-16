import { View, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import { Text, Card, Button, FAB } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function CrisisSupportScreen() {
  const router = useRouter();

  const callEmergency = () => {
    Linking.openURL('tel:911');
  };

  const callSuicidePrevention = () => {
    Linking.openURL('tel:988');
  };

  const textCrisis = () => {
    Linking.openURL('sms:741741&body=HOME');
  };

  const startGroundingExercise = () => {
    router.push('/grounding-exercise');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Back Button */}
        <Button
          mode="outlined"
          style={styles.backButton}
          onPress={() => router.back()}
          icon="arrow-left"
          textColor="#22c55e"
        >
          Back to Chat
        </Button>

        {/* Crisis Support Header */}
        <View style={styles.crisisHeader}>
          <Text variant="headlineLarge" style={styles.crisisTitle}>
            🚨 Crisis Support
          </Text>
          <Text variant="bodyLarge" style={styles.crisisSubtitle}>
            You are not alone. Help is available right now.
          </Text>
        </View>

        {/* Immediate Help Section */}
        <View style={styles.immediateHelpSection}>
          <Text variant="headlineMedium" style={styles.immediateHelpTitle}>
            Immediate Help
          </Text>
          <Text variant="bodyLarge" style={styles.immediateHelpText}>
            If you're in immediate danger or having thoughts of self-harm, please reach out now:
          </Text>

          <View style={styles.helpButtons}>
            <Button
              mode="contained"
              style={[styles.emergencyButton, { backgroundColor: '#22c55e' }]}
              onPress={callSuicidePrevention}
              icon="phone"
              textColor="#000000"
            >
              Call 988 (Suicide Prevention)
            </Button>

            <Button
              mode="contained"
              style={[styles.emergencyButton, { backgroundColor: '#dc2626' }]}
              onPress={callEmergency}
              icon="alert-circle"
              textColor="#ffffff"
            >
              Call 911 (Emergency)
            </Button>

            <Button
              mode="contained"
              style={[styles.emergencyButton, { backgroundColor: '#34d399' }]}
              onPress={textCrisis}
              icon="message"
              textColor="#000000"
            >
              Text HOME to 741741
            </Button>
          </View>
        </View>

        {/* Grounding Exercise Card */}
        <Card style={styles.groundingCard}>
          <Card.Content>
            <View style={styles.groundingHeader}>
              <Text variant="headlineSmall" style={styles.groundingTitle}>
                🧘 Grounding Exercise
              </Text>
            </View>
            <Text variant="bodyLarge" style={styles.groundingSubtitle}>
              If you're feeling overwhelmed, try this 5-4-3-2-1 technique:
            </Text>

            <View style={styles.exerciseSteps}>
              <View style={styles.exerciseStep}>
                <Text variant="titleMedium" style={styles.stepNumber}>5</Text>
                <Text variant="bodyMedium" style={styles.stepText}>
                  things you can see: Look around and name 5 things you can see
                </Text>
              </View>

              <View style={styles.exerciseStep}>
                <Text variant="titleMedium" style={styles.stepNumber}>4</Text>
                <Text variant="bodyMedium" style={styles.stepText}>
                  things you can touch: Name 4 things you can feel with your hands
                </Text>
              </View>

              <View style={styles.exerciseStep}>
                <Text variant="titleMedium" style={styles.stepNumber}>3</Text>
                <Text variant="bodyMedium" style={styles.stepText}>
                  things you can hear: Listen and identify 3 sounds around you
                </Text>
              </View>

              <View style={styles.exerciseStep}>
                <Text variant="titleMedium" style={styles.stepNumber}>2</Text>
                <Text variant="bodyMedium" style={styles.stepText}>
                  things you can smell: Take a deep breath and notice 2 scents
                </Text>
              </View>

              <View style={styles.exerciseStep}>
                <Text variant="titleMedium" style={styles.stepNumber}>1</Text>
                <Text variant="bodyMedium" style={styles.stepText}>
                  thing you can taste: Focus on 1 taste in your mouth
                </Text>
              </View>
            </View>

            <Button
              mode="contained"
              style={styles.groundingButton}
              onPress={startGroundingExercise}
              textColor="#000000"
            >
              Start Grounding Exercise
            </Button>
          </Card.Content>
        </Card>

        {/* Supportive Message */}
        <Card style={styles.supportCard}>
          <Card.Content>
            <View style={styles.supportHeader}>
              <Text variant="headlineSmall" style={styles.supportTitle}>
                💙 Remember
              </Text>
            </View>
            <View style={styles.supportList}>
              <Text variant="bodyLarge" style={styles.supportItem}>
                • You are not alone in this moment
              </Text>
              <Text variant="bodyLarge" style={styles.supportItem}>
                • These feelings are temporary
              </Text>
              <Text variant="bodyLarge" style={styles.supportItem}>
                • You are worthy of help and support
              </Text>
              <Text variant="bodyLarge" style={styles.supportItem}>
                • There are people who care about you
              </Text>
              <Text variant="bodyLarge" style={styles.supportItem}>
                • This crisis will pass
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Continue Chat Button */}
        <Button
          mode="contained"
          style={styles.continueButton}
          onPress={() => router.push('/(tabs)/chat')}
          textColor="#000000"
        >
          Continue Chat with AI
        </Button>
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
    padding: 16,
  },
  backButton: {
    marginBottom: 16,
    borderColor: '#22c55e',
  },
  crisisHeader: {
    backgroundColor: '#dc2626', // Red background for crisis
    padding: 24,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  crisisTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  crisisSubtitle: {
    color: '#ffffff',
    textAlign: 'center',
  },
  immediateHelpSection: {
    backgroundColor: '#7f1d1d', // Darker red background
    padding: 24,
    borderRadius: 12,
    marginBottom: 16,
  },
  immediateHelpTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  immediateHelpText: {
    color: '#ffffff',
    marginBottom: 16,
  },
  helpButtons: {
    gap: 12,
  },
  emergencyButton: {
    backgroundColor: '#dc2626',
  },
  groundingCard: {
    backgroundColor: '#1f2937', // Dark surface
    marginBottom: 16,
  },
  groundingHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  groundingTitle: {
    color: '#22c55e', // Light blue
    fontWeight: 'bold',
  },
  groundingSubtitle: {
    color: '#d1d5db', // Light gray
    textAlign: 'center',
    marginBottom: 20,
  },
  exerciseSteps: {
    gap: 12,
    marginBottom: 20,
  },
  exerciseStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#374151', // Dark gray
    padding: 12,
    borderRadius: 8,
  },
  stepNumber: {
    color: '#22c55e', // Light blue
    fontWeight: 'bold',
    marginRight: 12,
    minWidth: 20,
  },
  stepText: {
    color: '#f9fafb', // Light text
    flex: 1,
  },
  groundingButton: {
    backgroundColor: '#22c55e', // Light blue
  },
  supportCard: {
    backgroundColor: '#1f2937', // Dark surface
    marginBottom: 16,
  },
  supportHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  supportTitle: {
    color: '#34d399', // Light green
    fontWeight: 'bold',
  },
  supportList: {
    gap: 8,
  },
  supportItem: {
    color: '#f9fafb', // Light text
  },
  continueButton: {
    backgroundColor: '#22c55e', // Light blue
    marginTop: 8,
  },
});
