import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Button, FAB, Chip, Divider } from 'react-native-paper';
import { useAuth } from '@/features/auth/AuthProvider';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';
import { useRouter } from 'expo-router';
import { FinanceTransaction } from '@packages/types';

type FinanceSummary = {
  total_spent: number;
  total_saved: number;
  balance: number;
};

export default function FinanceScreen() {
  const { sessionId } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [sessionId]);

  const loadData = async () => {
    try {
      if (sessionId) apiClient.setSessionId(sessionId);
      
      const [transactionsRes, summaryRes] = await Promise.all([
        apiClient.request('/finance/transactions'),
        apiClient.request('/finance/summary'),
      ]);
      
      setTransactions((transactionsRes as any).data || []);
      setSummary((summaryRes as any).data || null);
    } catch (error) {
      console.error('Failed to load finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTransactionIcon = (kind: string) => {
    return kind === 'spend' ? 'trending-down' : 'trending-up';
  };

  const getTransactionColor = (kind: string) => {
    return kind === 'spend' ? '#dc2626' : '#059669';
  };

  const renderTransaction = ({ item }: { item: FinanceTransaction }) => (
    <Card style={styles.transactionCard}>
      <Card.Content>
        <View style={styles.transactionHeader}>
          <View style={styles.transactionInfo}>
            <Text variant="titleMedium" style={styles.transactionTitle}>
              {item.note || `${item.kind === 'spend' ? 'Spent' : 'Saved'} money`}
            </Text>
            <Text variant="bodySmall" style={styles.transactionDate}>
              {formatDate(item.occurred_at)}
            </Text>
          </View>
          
          <View style={styles.transactionAmount}>
            <Text 
              variant="titleLarge" 
              style={[
                styles.amountText, 
                { color: getTransactionColor(item.kind) }
              ]}
            >
              {item.kind === 'spend' ? '-' : '+'}{formatCurrency(item.amount_cents)}
            </Text>
            <Chip 
              icon={getTransactionIcon(item.kind)}
              style={[
                styles.kindChip, 
                { backgroundColor: getTransactionColor(item.kind) + '20' }
              ]}
              textStyle={{ color: getTransactionColor(item.kind) }}
            >
              {item.kind}
            </Chip>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>Finance</Text>
        <Text variant="bodyLarge" style={styles.loadingText}>Loading transactions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>Finance</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Track your spending and savings
        </Text>
      </View>

      {summary && (
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.summaryTitle}>
              This Week's Summary
            </Text>
            
            <View style={styles.summaryRow}>
              <Text variant="bodyLarge" style={styles.summaryLabel}>Saved:</Text>
              <Text variant="titleMedium" style={styles.savedAmount}>
                {formatCurrency(summary.total_saved)}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text variant="bodyLarge" style={styles.summaryLabel}>Spent:</Text>
              <Text variant="titleMedium" style={styles.spentAmount}>
                {formatCurrency(summary.total_spent)}
              </Text>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.summaryRow}>
              <Text variant="titleLarge" style={styles.balanceLabel}>Balance:</Text>
              <Text 
                variant="headlineSmall" 
                style={[
                  styles.balanceAmount,
                  { color: summary.balance >= 0 ? '#059669' : '#dc2626' }
                ]}
              >
                {formatCurrency(summary.balance)}
              </Text>
            </View>
          </Card.Content>
        </Card>
      )}

      {transactions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text variant="headlineSmall" style={styles.emptyTitle}>
            No transactions yet
          </Text>
          <Text variant="bodyLarge" style={styles.emptyText}>
            Start tracking your spending and savings
          </Text>
          <Button 
            mode="contained" 
            style={styles.addButton}
            onPress={() => router.push('/finance/add')}
          >
            Add First Transaction
          </Button>
        </View>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/finance/add')}
        label="Add Transaction"
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
    color: '#60a5fa', // Light blue for dark theme
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
  summaryCard: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: '#1f2937', // Dark surface
  },
  summaryTitle: {
    color: '#f9fafb', // Light text
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#d1d5db', // Light gray text
  },
  savedAmount: {
    color: '#34d399', // Light green for dark theme
    fontWeight: '600',
  },
  spentAmount: {
    color: '#f87171', // Light red for dark theme
    fontWeight: '600',
  },
  divider: {
    marginVertical: 12,
  },
  balanceLabel: {
    color: '#f9fafb', // Light text
    fontWeight: '600',
  },
  balanceAmount: {
    fontWeight: 'bold',
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
    backgroundColor: '#60a5fa', // Light blue for dark theme
  },
  listContainer: {
    padding: 16,
  },
  transactionCard: {
    marginBottom: 12,
    backgroundColor: '#1f2937', // Dark surface
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  transactionInfo: {
    flex: 1,
    marginRight: 16,
  },
  transactionTitle: {
    color: '#f9fafb', // Light text
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionDate: {
    color: '#9ca3af',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  kindChip: {
    // Color will be set dynamically
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#60a5fa', // Light blue for dark theme
  },
});
