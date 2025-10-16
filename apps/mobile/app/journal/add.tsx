import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Card, HelperText } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'expo-router';
import { useAuth } from '@/features/auth/AuthProvider';
import { apiClient } from '@/lib/apiClient';
import { useState } from 'react';

const journalEntrySchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  mood: z.number().min(-5).max(5).optional(),
  urge_level: z.number().min(0).max(10).optional(),
});

type JournalEntryForm = z.infer<typeof journalEntrySchema>;

export default function AddJournalEntryScreen() {
  const router = useRouter();
  const { sessionId } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<JournalEntryForm>({
    resolver: zodResolver(journalEntrySchema),
    defaultValues: {
      mood: 0,
      urge_level: 0,
    },
  });

  const watchedMood = watch('mood');
  const watchedUrge = watch('urge_level');

  const getMoodEmoji = (mood?: number) => {
    if (mood === undefined) return '😐';
    if (mood >= 3) return '😊';
    if (mood >= 1) return '🙂';
    if (mood >= -1) return '😐';
    if (mood >= -3) return '😔';
    return '😢';
  };

  const getMoodLabel = (mood?: number) => {
    if (mood === undefined) return 'Neutral';
    if (mood >= 3) return 'Great';
    if (mood >= 1) return 'Good';
    if (mood >= -1) return 'Neutral';
    if (mood >= -3) return 'Low';
    return 'Very Low';
  };

  const getUrgeLabel = (level?: number) => {
    if (level === undefined) return 'None';
    if (level >= 8) return 'Very High';
    if (level >= 6) return 'High';
    if (level >= 4) return 'Medium';
    if (level >= 2) return 'Low';
    return 'Very Low';
  };

  const onSubmit = async (data: JournalEntryForm) => {
    setIsSubmitting(true);
    try {
      if (sessionId) apiClient.setSessionId(sessionId);
      await apiClient.request('/journal', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      router.back();
    } catch (error) {
      console.error('Failed to create journal entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Add Journal Entry
        </Text>
        
        <Text variant="bodyLarge" style={styles.subtitle}>
          Track your mood and thoughts
        </Text>

        <Card style={styles.card}>
          <Card.Content>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextInput
                    label="Title (Optional)"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    style={styles.input}
                    error={!!errors.title}
                  />
                  {errors.title && (
                    <HelperText type="error" visible={!!errors.title}>
                      {errors.title.message}
                    </HelperText>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="content"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextInput
                    label="How are you feeling today?"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    multiline
                    numberOfLines={4}
                    style={styles.textArea}
                    error={!!errors.content}
                  />
                  {errors.content && (
                    <HelperText type="error" visible={!!errors.content}>
                      {errors.content.message}
                    </HelperText>
                  )}
                </View>
              )}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Mood Scale
            </Text>
            <Text variant="bodyMedium" style={styles.sectionSubtitle}>
              How is your overall mood today?
            </Text>
            
            <Controller
              control={control}
              name="mood"
              render={({ field: { onChange, value } }) => (
                <View style={styles.sliderContainer}>
                  <View style={styles.sliderHeader}>
                    <Text variant="bodyLarge" style={styles.moodEmoji}>
                      {getMoodEmoji(value)}
                    </Text>
                    <Text variant="titleMedium" style={styles.moodLabel}>
                      {getMoodLabel(value)} ({value})
                    </Text>
                  </View>
                  
                  <Slider
                    style={styles.slider}
                    minimumValue={-5}
                    maximumValue={5}
                    step={1}
                    value={value}
                    onValueChange={onChange}
                    minimumTrackTintColor="#1e3a8a"
                    maximumTrackTintColor="#e5e7eb"
                    thumbTintColor="#1e3a8a"
                  />
                  
                  <View style={styles.sliderLabels}>
                    <Text variant="bodySmall" style={styles.sliderLabel}>Very Low (-5)</Text>
                    <Text variant="bodySmall" style={styles.sliderLabel}>Very High (+5)</Text>
                  </View>
                </View>
              )}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Urge Level
            </Text>
            <Text variant="bodyMedium" style={styles.sectionSubtitle}>
              How strong is your urge to gamble right now?
            </Text>
            
            <Controller
              control={control}
              name="urge_level"
              render={({ field: { onChange, value } }) => (
                <View style={styles.sliderContainer}>
                  <View style={styles.sliderHeader}>
                    <Text variant="titleMedium" style={styles.urgeLabel}>
                      {getUrgeLabel(value)} ({value}/10)
                    </Text>
                  </View>
                  
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={10}
                    step={1}
                    value={value}
                    onValueChange={onChange}
                    minimumTrackTintColor="#dc2626"
                    maximumTrackTintColor="#e5e7eb"
                    thumbTintColor="#dc2626"
                  />
                  
                  <View style={styles.sliderLabels}>
                    <Text variant="bodySmall" style={styles.sliderLabel}>None (0)</Text>
                    <Text variant="bodySmall" style={styles.sliderLabel}>Very High (10)</Text>
                  </View>
                </View>
              )}
            />
          </Card.Content>
        </Card>

        <View style={styles.buttonContainer}>
          <Button 
            mode="outlined" 
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            Cancel
          </Button>
          
          <Button 
            mode="contained" 
            style={styles.submitButton}
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Save Entry
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
  },
  title: {
    color: '#1e3a8a',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#64748b',
    marginBottom: 24,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  input: {
    marginBottom: 16,
  },
  textArea: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#1f2937',
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: '#6b7280',
    marginBottom: 16,
  },
  sliderContainer: {
    marginBottom: 8,
  },
  sliderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  moodEmoji: {
    fontSize: 32,
    marginRight: 8,
  },
  moodLabel: {
    color: '#1f2937',
    fontWeight: '500',
  },
  urgeLabel: {
    color: '#dc2626',
    fontWeight: '500',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sliderLabel: {
    color: '#6b7280',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    borderColor: '#6b7280',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#1e3a8a',
  },
});
