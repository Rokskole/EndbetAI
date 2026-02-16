import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Button, FAB, Chip, Checkbox } from 'react-native-paper';
import { useAuth } from '@/features/auth/AuthProvider';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';
import { useRouter } from 'expo-router';
import { Task } from '@packages/types';

export default function TasksScreen() {
  const { sessionId } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, [sessionId]);

  const loadTasks = async () => {
    try {
      if (sessionId) apiClient.setSessionId(sessionId);
      const res = await apiClient.request('/tasks');
      setTasks((res as any).data || []);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId: string) => {
    try {
      if (sessionId) apiClient.setSessionId(sessionId);
      await apiClient.request(`/tasks/${taskId}/complete`, {
        method: 'POST',
        body: JSON.stringify({ rating: 5 }), // Default rating
      });
      // Reload tasks to show updated state
      loadTasks();
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  const getTaskIcon = (kind: string) => {
    const icons: Record<string, string> = {
      breathing: 'weather-windy',
      reframe: 'lightbulb',
      alt_hobby: 'palette',
      exercise: 'dumbbell',
      meditation: 'yoga',
    };
    return icons[kind] || 'check-circle';
  };

  const getTaskColor = (kind: string) => {
    const colors: Record<string, string> = {
      breathing: '#22c55e',
      reframe: '#8b5cf6',
      alt_hobby: '#f59e0b',
      exercise: '#ef4444',
      meditation: '#10b981',
    };
    return colors[kind] || '#6b7280';
  };

  const getTaskDescription = (kind: string) => {
    const descriptions: Record<string, string> = {
      breathing: 'Take 5 deep breaths to center yourself',
      reframe: 'Challenge negative thoughts with positive alternatives',
      alt_hobby: 'Engage in a healthy activity you enjoy',
      exercise: 'Get your body moving with physical activity',
      meditation: 'Practice mindfulness and present moment awareness',
    };
    return descriptions[kind] || 'Complete this task to support your recovery';
  };

  const renderTask = ({ item }: { item: Task }) => (
    <Card style={styles.taskCard}>
      <Card.Content>
        <View style={styles.taskHeader}>
          <View style={styles.taskInfo}>
            <Text variant="titleMedium" style={styles.taskTitle}>
              {item.title}
            </Text>
            <Text variant="bodyMedium" style={styles.taskDescription}>
              {getTaskDescription(item.kind)}
            </Text>
          </View>
          
          <Chip 
            icon={getTaskIcon(item.kind)}
            style={[
              styles.kindChip, 
              { backgroundColor: getTaskColor(item.kind) + '20' }
            ]}
            textStyle={{ color: getTaskColor(item.kind) }}
          >
            {item.kind.replace('_', ' ')}
          </Chip>
        </View>

        <View style={styles.taskActions}>
          <Button 
            mode="contained" 
            style={[
              styles.completeButton,
              { backgroundColor: getTaskColor(item.kind) }
            ]}
            onPress={() => completeTask(item.id)}
            icon="check"
          >
            Complete
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>Daily Tasks</Text>
        <Text variant="bodyLarge" style={styles.loadingText}>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>Daily Tasks</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Complete these tasks to support your recovery
        </Text>
      </View>

      {tasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text variant="headlineSmall" style={styles.emptyTitle}>
            No tasks available
          </Text>
          <Text variant="bodyLarge" style={styles.emptyText}>
            Check back later for your daily recovery tasks
          </Text>
          <Button 
            mode="contained" 
            style={styles.refreshButton}
            onPress={loadTasks}
          >
            Refresh
          </Button>
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FAB
        icon="refresh"
        style={styles.fab}
        onPress={loadTasks}
        label="Refresh"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827', // Dark background
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    color: '#22c55e', // Light blue for dark theme
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#9ca3af', // Light gray for dark theme
  },
  loadingText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 32,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    color: '#f9fafb', // Light text
    marginBottom: 8,
  },
  emptyText: {
    color: '#9ca3af', // Light gray for dark theme
    textAlign: 'center',
    marginBottom: 24,
  },
  refreshButton: {
    backgroundColor: '#22c55e', // Light blue for dark theme
  },
  listContainer: {
    padding: 16,
  },
  taskCard: {
    marginBottom: 12,
    backgroundColor: '#1f2937', // Dark surface
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  taskInfo: {
    flex: 1,
    marginRight: 16,
  },
  taskTitle: {
    color: '#f9fafb', // Light text
    fontWeight: '600',
    marginBottom: 4,
  },
  taskDescription: {
    color: '#d1d5db', // Light gray text
    lineHeight: 20,
  },
  kindChip: {
    // Color will be set dynamically
  },
  taskActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  completeButton: {
    // Color will be set dynamically
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#14532d',
  },
});
