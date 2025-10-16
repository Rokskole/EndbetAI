import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Card, SegmentedButtons, HelperText } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'expo-router';
import { useAuth } from '@/features/auth/AuthProvider';
import { apiClient } from '@/lib/apiClient';
import { useState } from 'react';

const financeTransactionSchema = z.object({
  kind: z.enum(['spend', 'save']),
  amount_cents: z.number().int().min(1),
  currency: z.string().length(3).default('USD'),
  note: z.string().optional(),
  occurred_at: z.string().datetime(),
});

type FinanceTransactionForm = z.infer<typeof financeTransactionSchema>;

export default function AddFinanceTransactionScreen() {
  const router = useRouter();
  const { sessionId } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FinanceTransactionForm>({
    resolver: zodResolver(financeTransactionSchema),
    defaultValues: {
      kind: 'spend',
      currency: 'USD',
      occurred_at: new Date().toISOString(),
    },
  });

  const watchedKind = watch('kind');

  const onSubmit = async (data: FinanceTransactionForm) => {
    setIsSubmitting(true);
    try {
      if (sessionId) apiClient.setSessionId(sessionId);
      await apiClient.request('/finance/transactions', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      router.back();
    } catch (error) {
      console.error('Failed to create finance transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatAmount = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const parseAmount = (value: string) => {
    const cleaned = value.replace(/[^0-9.]/g, '');
    const dollars = parseFloat(cleaned) || 0;
    return Math.round(dollars * 100);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Add Transaction
        </Text>
        
        <Text variant="bodyLarge" style={styles.subtitle}>
          Track your spending and savings
        </Text>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Transaction Type
            </Text>
            
            <Controller
              control={control}
              name="kind"
              render={({ field: { onChange, value } }) => (
                <SegmentedButtons
                  value={value}
                  onValueChange={onChange}
                  buttons={[
                    {
                      value: 'spend',
                      label: 'Spent',
                      icon: 'trending-down',
                    },
                    {
                      value: 'save',
                      label: 'Saved',
                      icon: 'trending-up',
                    },
                  ]}
                  style={styles.segmentedButtons}
                />
              )}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Amount
            </Text>
            
            <Controller
              control={control}
              name="amount_cents"
              render={({ field: { onChange, value } }) => (
                <View>
                  <TextInput
                    label="Amount"
                    value={formatAmount(value)}
                    onChangeText={(text) => onChange(parseAmount(text))}
                    keyboardType="numeric"
                    style={styles.input}
                    error={!!errors.amount_cents}
                    left={<TextInput.Icon icon="currency-usd" />}
                  />
                  {errors.amount_cents && (
                    <HelperText type="error" visible={!!errors.amount_cents}>
                      {errors.amount_cents.message}
                    </HelperText>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="note"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextInput
                    label="Note (Optional)"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    style={styles.input}
                    error={!!errors.note}
                    placeholder="What was this for?"
                  />
                  {errors.note && (
                    <HelperText type="error" visible={!!errors.note}>
                      {errors.note.message}
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
              Date & Time
            </Text>
            
            <Controller
              control={control}
              name="occurred_at"
              render={({ field: { onChange, value } }) => (
                <View>
                  <TextInput
                    label="When did this happen?"
                    value={new Date(value).toLocaleString()}
                    onPressIn={() => {
                      // TODO: Implement date picker
                      // For now, just show current time
                    }}
                    style={styles.input}
                    editable={false}
                    right={<TextInput.Icon icon="calendar" />}
                  />
                  <HelperText type="info">
                    Currently set to: {new Date(value).toLocaleString()}
                  </HelperText>
                </View>
              )}
            />
          </Card.Content>
        </Card>

        <View style={styles.summaryCard}>
          <Text variant="titleMedium" style={styles.summaryTitle}>
            Summary
          </Text>
          <Text variant="bodyLarge" style={styles.summaryText}>
            {watchedKind === 'spend' ? 'You spent' : 'You saved'}{' '}
            {formatAmount(watch('amount_cents'))} on{' '}
            {new Date(watch('occurred_at')).toLocaleDateString()}
          </Text>
        </View>

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
            style={[
              styles.submitButton,
              { backgroundColor: watchedKind === 'spend' ? '#dc2626' : '#059669' }
            ]}
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {watchedKind === 'spend' ? 'Record Spending' : 'Record Savings'}
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
  sectionTitle: {
    color: '#1f2937',
    fontWeight: '600',
    marginBottom: 16,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  summaryTitle: {
    color: '#1f2937',
    fontWeight: '600',
    marginBottom: 8,
  },
  summaryText: {
    color: '#374151',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    borderColor: '#6b7280',
  },
  submitButton: {
    flex: 1,
  },
});
