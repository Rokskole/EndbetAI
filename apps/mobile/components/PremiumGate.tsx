import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { usePremium } from '@/features/premium/PremiumProvider';
import { PurchaseModal } from './PurchaseModal';

interface PremiumGateProps {
  children: React.ReactNode;
  featureName?: string;
  showUpgradeButton?: boolean;
}

/**
 * Component that gates premium features behind a paywall
 */
export function PremiumGate({
  children,
  featureName = 'This feature',
  showUpgradeButton = true,
}: PremiumGateProps) {
  const { isPremium, isLoading } = usePremium();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <>
      <Card style={styles.paywall}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>
            🔒 Premium Feature
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            {featureName} is available for premium users. Upgrade to unlock all premium features and support your recovery journey.
          </Text>

          {showUpgradeButton && (
            <Button
              mode="contained"
              onPress={() => setShowPurchaseModal(true)}
              style={styles.upgradeButton}
            >
              Upgrade to Premium
            </Button>
          )}
        </Card.Content>
      </Card>

      <PurchaseModal
        visible={showPurchaseModal}
        onDismiss={() => setShowPurchaseModal(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#9ca3af',
  },
  paywall: {
    backgroundColor: '#1f2937',
    margin: 16,
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  title: {
    color: '#f9fafb',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    color: '#d1d5db',
    marginBottom: 20,
    textAlign: 'center',
  },
  upgradeButton: {
    backgroundColor: '#22c55e',
  },
});

