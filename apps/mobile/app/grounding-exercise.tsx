import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function GroundingExerciseScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Grounding Exercise Card */}
        <Card style={[styles.groundingCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.groundingHeader}>
              <Text variant="headlineMedium" style={[styles.groundingTitle, { color: theme.colors.onSurface }]}>
                🧘 Grounding Exercise
              </Text>
            </View>
            <Text variant="bodyLarge" style={[styles.groundingSubtitle, { color: theme.colors.onSurface }]}>
              If you're feeling overwhelmed, try this 5-4-3-2-1 technique:
            </Text>

            <View style={styles.exerciseSteps}>
              <View style={styles.exerciseStep}>
                <Text variant="titleLarge" style={[styles.stepNumber, { color: theme.colors.primary }]}>5</Text>
                <Text variant="bodyLarge" style={[styles.stepText, { color: theme.colors.onSurface }]}>
                  things you can see: Look around and name 5 things you can see
                </Text>
              </View>

              <View style={styles.exerciseStep}>
                <Text variant="titleLarge" style={[styles.stepNumber, { color: theme.colors.primary }]}>4</Text>
                <Text variant="bodyLarge" style={[styles.stepText, { color: theme.colors.onSurface }]}>
                  things you can touch: Name 4 things you can feel with your hands
                </Text>
              </View>

              <View style={styles.exerciseStep}>
                <Text variant="titleLarge" style={[styles.stepNumber, { color: theme.colors.primary }]}>3</Text>
                <Text variant="bodyLarge" style={[styles.stepText, { color: theme.colors.onSurface }]}>
                  things you can hear: Listen and identify 3 sounds around you
                </Text>
              </View>

              <View style={styles.exerciseStep}>
                <Text variant="titleLarge" style={[styles.stepNumber, { color: theme.colors.primary }]}>2</Text>
                <Text variant="bodyLarge" style={[styles.stepText, { color: theme.colors.onSurface }]}>
                  things you can smell: Take a deep breath and notice 2 scents
                </Text>
              </View>

              <View style={styles.exerciseStep}>
                <Text variant="titleLarge" style={[styles.stepNumber, { color: theme.colors.primary }]}>1</Text>
                <Text variant="bodyLarge" style={[styles.stepText, { color: theme.colors.onSurface }]}>
                  thing you can taste: Focus on 1 taste in your mouth
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Supportive Message */}
        <Card style={[styles.supportCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.supportHeader}>
              <Text variant="headlineMedium" style={[styles.supportTitle, { color: theme.colors.primary }]}>
                💙 Remember
              </Text>
            </View>
            <View style={styles.supportList}>
              <Text variant="bodyLarge" style={[styles.supportItem, { color: theme.colors.onSurface }]}>
                • You are not alone in this moment
              </Text>
              <Text variant="bodyLarge" style={[styles.supportItem, { color: theme.colors.onSurface }]}>
                • These feelings are temporary
              </Text>
              <Text variant="bodyLarge" style={[styles.supportItem, { color: theme.colors.onSurface }]}>
                • You are worthy of help and support
              </Text>
              <Text variant="bodyLarge" style={[styles.supportItem, { color: theme.colors.onSurface }]}>
                • There are people who care about you
              </Text>
              <Text variant="bodyLarge" style={[styles.supportItem, { color: theme.colors.onSurface }]}>
                • This crisis will pass
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Continue Chat Button */}
        <Button
          mode="contained"
          style={[styles.continueButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => router.push('/(tabs)/chat')}
          textColor={theme.colors.onPrimary}
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
  groundingCard: {
    backgroundColor: '#1f2937', // Dark surface
    marginBottom: 16,
  },
  groundingHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  groundingTitle: {
    color: '#60a5fa', // Light blue
    fontWeight: 'bold',
  },
  groundingSubtitle: {
    color: '#d1d5db', // Light gray
    textAlign: 'center',
    marginBottom: 20,
  },
  exerciseSteps: {
    gap: 12,
  },
  exerciseStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#374151', // Dark gray
    padding: 16,
    borderRadius: 12,
  },
  stepNumber: {
    color: '#60a5fa', // Light blue
    fontWeight: 'bold',
    marginRight: 16,
    minWidth: 30,
  },
  stepText: {
    color: '#f9fafb', // Light text
    flex: 1,
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
    backgroundColor: '#60a5fa', // Light blue
    marginTop: 8,
  },
});
