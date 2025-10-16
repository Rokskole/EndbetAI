import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, FAB, useTheme } from 'react-native-paper';
import { useAuth } from '@/features/auth/AuthProvider';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';
import { useRouter } from 'expo-router';

type Summary = {
  daily_goal: string;
  tasksCompleted7d: number;
  journalCount7d: number;
  finance: { total_spent: number; total_saved: number; balance: number };
};

export default function DashboardScreen() {
  const theme = useTheme();
  const { user, sessionId } = useAuth();
  const router = useRouter();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        if (sessionId) apiClient.setSessionId(sessionId);
        const res = await apiClient.request('/users/summary');
        if (!mounted) return;
        setSummary((res as any).data);
      } catch (e) {
        // noop
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [sessionId]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.content}>
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
          Welcome back, {user?.display_name || 'Friend'}
        </Text>

        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleLarge" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
              Today's Goal
            </Text>
            <Text variant="bodyLarge" style={[styles.cardText, { color: theme.colors.onSurface }]}>
              {summary?.daily_goal || 'Loading...'}
            </Text>
            <Button 
              mode="contained" 
              style={styles.button}
              onPress={() => {/* TODO: Navigate to task */}}
            >
              Start Now
            </Button>
          </Card.Content>
        </Card>

        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleLarge" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
              Progress This Week
            </Text>
            <Text variant="bodyLarge" style={[styles.cardText, { color: theme.colors.onSurface }]}>
              Tasks completed: {summary?.tasksCompleted7d ?? 0}
            </Text>
            <Text variant="bodyMedium" style={[styles.progressText, { color: theme.colors.secondary }]}>
              Journal entries: {summary?.journalCount7d ?? 0}
            </Text>
          </Card.Content>
        </Card>

        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleLarge" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
              Finance Summary (7 days)
            </Text>
            <Text variant="bodyLarge" style={[styles.cardText, { color: theme.colors.onSurface }]}>
              Saved: {(summary?.finance.total_saved ?? 0) / 100} | Spent: {(summary?.finance.total_spent ?? 0) / 100}
            </Text>
        <Button 
          mode="outlined" 
          style={[styles.button, { borderColor: theme.colors.primary }]}
          onPress={() => {/* TODO: Navigate to journal */}}
        >
          View Details
        </Button>
      </Card.Content>
    </Card>

    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <Text variant="titleLarge" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
          Theme Test
        </Text>
        <Text variant="bodyLarge" style={[styles.cardText, { color: theme.colors.onSurface }]}>
          Test the dark theme implementation
        </Text>
        <Button 
          mode="contained" 
          style={[styles.button, { backgroundColor: theme.colors.tertiary }]}
          onPress={() => router.push('/test-theme')}
        >
          Test Theme
        </Button>
        <Button 
          mode="contained" 
          style={[styles.button, { backgroundColor: '#dc2626' }]}
          onPress={() => router.push('/dark-test')}
        >
          Dark Test
        </Button>
        <Button 
          mode="contained" 
          style={[styles.button, { backgroundColor: '#f87171' }]}
          onPress={() => router.push('/crisis-dark')}
        >
          Crisis Dark
        </Button>
      </Card.Content>
    </Card>
      </ScrollView>

      <View style={styles.fabContainer}>
        <FAB
          icon="heart"
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={() => router.push('/crisis-support')}
          label="Crisis"
        />
        <FAB
          icon="alert-circle"
          style={[styles.fab, { backgroundColor: theme.colors.error }]}
          onPress={() => router.push('/sos')}
          label="SOS"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 24,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardText: {
    marginBottom: 16,
  },
  progressText: {
    fontWeight: '500',
  },
  button: {
    // Theme colors will be applied inline
  },
  fabContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    gap: 12,
  },
  fab: {
    // Theme colors will be applied inline
  },
});
