import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Modal, Portal, Text, Button, Card, List } from 'react-native-paper';
import { paymentService, Product, PRODUCT_IDS } from '@/lib/payments';
import { usePremium } from '@/features/premium/PremiumProvider';
import { Platform } from 'react-native';

interface PurchaseModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export function PurchaseModal({ visible, onDismiss }: PurchaseModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const { refreshPremiumStatus } = usePremium();

  useEffect(() => {
    if (visible) {
      loadProducts();
    }
  }, [visible]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const availableProducts = await paymentService.getProducts();
      setProducts(availableProducts);
    } catch (error) {
      console.error('Failed to load products:', error);
      Alert.alert('Error', 'Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (productId: string) => {
    setPurchasing(productId);
    try {
      const result = await paymentService.purchaseProduct(productId as any);

      if (result.success) {
        Alert.alert(
          'Success!',
          'Your purchase was successful. Premium features are now unlocked.',
          [
            {
              text: 'OK',
              onPress: () => {
                refreshPremiumStatus();
                onDismiss();
              },
            },
          ]
        );
      } else {
        Alert.alert('Purchase Failed', result.error || 'Please try again.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Purchase failed. Please try again.');
    } finally {
      setPurchasing(null);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    try {
      const results = await paymentService.restorePurchases();

      if (results.length > 0 && results[0].success) {
        Alert.alert('Success', 'Previous purchases restored successfully!');
        refreshPremiumStatus();
        onDismiss();
      } else {
        Alert.alert('No Purchases Found', 'We could not find any previous purchases to restore.');
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.container}
      >
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              Unlock Premium Features
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Get access to all premium features and support your recovery journey.
            </Text>

            {loading ? (
              <View style={styles.loading}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Loading products...</Text>
              </View>
            ) : (
              <>
                {products.length === 0 ? (
                  <Text style={styles.emptyText}>
                    No products available at the moment. Please try again later.
                  </Text>
                ) : (
                  <View style={styles.productsList}>
                    {products.map((product) => (
                      <Card
                        key={product.productId}
                        style={styles.productCard}
                        onPress={() => handlePurchase(product.productId)}
                      >
                        <Card.Content>
                          <View style={styles.productRow}>
                            <View style={styles.productInfo}>
                              <Text variant="titleMedium" style={styles.productTitle}>
                                {product.title}
                              </Text>
                              <Text variant="bodySmall" style={styles.productDescription}>
                                {product.description}
                              </Text>
                            </View>
                            <View style={styles.productPrice}>
                              <Text variant="titleLarge" style={styles.priceText}>
                                {product.price}
                              </Text>
                              <Button
                                mode="contained"
                                onPress={() => handlePurchase(product.productId)}
                                loading={purchasing === product.productId}
                                disabled={!!purchasing}
                                style={styles.purchaseButton}
                              >
                                {purchasing === product.productId ? 'Processing...' : 'Purchase'}
                              </Button>
                            </View>
                          </View>
                        </Card.Content>
                      </Card>
                    ))}
                  </View>
                )}

                {Platform.OS === 'ios' && (
                  <Button
                    mode="text"
                    onPress={handleRestore}
                    style={styles.restoreButton}
                    disabled={loading || !!purchasing}
                  >
                    Restore Purchases
                  </Button>
                )}
              </>
            )}

            <Button
              mode="outlined"
              onPress={onDismiss}
              style={styles.cancelButton}
              disabled={loading || !!purchasing}
            >
              Cancel
            </Button>
          </Card.Content>
        </Card>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  card: {
    backgroundColor: '#1f2937',
  },
  title: {
    marginBottom: 8,
    color: '#f9fafb',
    fontWeight: 'bold',
  },
  subtitle: {
    marginBottom: 24,
    color: '#d1d5db',
  },
  loading: {
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    color: '#9ca3af',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    padding: 32,
  },
  productsList: {
    gap: 12,
    marginBottom: 16,
  },
  productCard: {
    backgroundColor: '#374151',
    marginBottom: 12,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
    marginRight: 16,
  },
  productTitle: {
    color: '#f9fafb',
    marginBottom: 4,
  },
  productDescription: {
    color: '#d1d5db',
  },
  productPrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    color: '#60a5fa',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  purchaseButton: {
    minWidth: 100,
  },
  restoreButton: {
    marginTop: 8,
    marginBottom: 8,
  },
  cancelButton: {
    marginTop: 16,
  },
});

