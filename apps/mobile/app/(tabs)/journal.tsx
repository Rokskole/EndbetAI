import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Text, Card, Button, FAB, Chip, Divider } from 'react-native-paper';
import { useAuth } from '@/features/auth/AuthProvider';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';
import { useRouter } from 'expo-router';
import { JournalEntry } from '@packages/types';

export default function JournalScreen() {
  const { sessionId } = useAuth();
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, [sessionId]);

  const loadEntries = async () => {
    try {
      if (sessionId) apiClient.setSessionId(sessionId);
      const res = await apiClient.request('/journal');
      setEntries((res as any).data || []);
    } catch (error) {
      console.error('Failed to load journal entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMoodEmoji = (mood?: number) => {
    if (mood === undefined) return '😐';
    if (mood >= 3) return '😊';
    if (mood >= 1) return '🙂';
    if (mood >= -1) return '😐';
    if (mood >= -3) return '😔';
    return '😢';
  };

  const getUrgeLevel = (level?: number) => {
    if (level === undefined) return 'Unknown';
    if (level >= 8) return 'Very High';
    if (level >= 6) return 'High';
    if (level >= 4) return 'Medium';
    if (level >= 2) return 'Low';
    return 'Very Low';
  };

  const getUrgeColor = (level?: number) => {
    if (level === undefined) return '#6b7280';
    if (level >= 8) return '#dc2626';
    if (level >= 6) return '#f59e0b';
    if (level >= 4) return '#eab308';
    if (level >= 2) return '#10b981';
    return '#059669';
  };

  const renderEntry = ({ item }: { item: JournalEntry }) => (
    <Card style={styles.entryCard}>
      <Card.Content>
        <View style={styles.entryHeader}>
          <Text variant="titleMedium" style={styles.entryTitle}>
            {item.title || 'Untitled Entry'}
          </Text>
          <Text variant="bodySmall" style={styles.entryDate}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
        
        {item.content && (
          <Text variant="bodyMedium" style={styles.entryContent}>
            {item.content}
          </Text>
        )}

        <View style={styles.entryMetrics}>
          {item.mood !== undefined && (
            <Chip 
              icon={() => <Text style={styles.moodEmoji}>{getMoodEmoji(item.mood)}</Text>}
              style={styles.moodChip}
            >
              Mood: {item.mood}
            </Chip>
          )}
          
          {item.urge_level !== undefined && (
            <Chip 
              style={[styles.urgeChip, { backgroundColor: getUrgeColor(item.urge_level) + '20' }]}
              textStyle={{ color: getUrgeColor(item.urge_level) }}
            >
              Urge: {getUrgeLevel(item.urge_level)}
            </Chip>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>Journal</Text>
        <Text variant="bodyLarge" style={styles.loadingText}>Loading entries...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>Journal</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Track your mood and urges
        </Text>
      </View>

      {entries.length === 0 ? (
        <View style={styles.emptyState}>
          <Text variant="headlineSmall" style={styles.emptyTitle}>
            No entries yet
          </Text>
          <Text variant="bodyLarge" style={styles.emptyText}>
            Start journaling to track your progress and mood
          </Text>
          <Button 
            mode="contained" 
            style={styles.addButton}
            onPress={() => router.push('/journal/add')}
          >
            Add First Entry
          </Button>
        </View>
      ) : (
        <FlatList
          data={entries}
          renderItem={renderEntry}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/journal/add')}
        label="Add Entry"
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
    color: '#22c55e', // Green for dark theme
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
  addButton: {
    backgroundColor: '#22c55e', // Green for dark theme
  },
  listContainer: {
    padding: 16,
  },
  entryCard: {
    marginBottom: 12,
    backgroundColor: '#1f2937', // Dark surface
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  entryTitle: {
    flex: 1,
    color: '#f9fafb', // Light text
    fontWeight: '600',
  },
  entryDate: {
    color: '#9ca3af', // Light gray for dark theme
  },
  entryContent: {
    color: '#d1d5db', // Light gray text
    marginBottom: 12,
    lineHeight: 20,
  },
  entryMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  moodChip: {
    backgroundColor: '#374151', // Dark gray chip
  },
  moodEmoji: {
    fontSize: 16,
  },
  urgeChip: {
    // Color will be set dynamically
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#22c55e', // Green for dark theme
  },
});
