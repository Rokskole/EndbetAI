import { View, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import { Text, Card, Button, FAB, Chip, Divider, useTheme } from 'react-native-paper';
import { useAuth } from '@/features/auth/AuthProvider';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';
import { useRouter } from 'expo-router';

type Helpline = {
  name: string;
  phone?: string;
  sms?: string;
  web?: string;
  priority: number;
};

type TrustedContact = {
  id: string;
  name: string;
  channel: 'sms' | 'email' | 'phone';
  value: string;
  is_primary: boolean;
};

export default function SosScreen() {
  const theme = useTheme();
  const { sessionId } = useAuth();
  const router = useRouter();
  const [helplines, setHelplines] = useState<Helpline[]>([]);
  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [sessionId]);

  const loadData = async () => {
    try {
      if (sessionId) apiClient.setSessionId(sessionId);
      
      const [helplinesRes, contactsRes] = await Promise.all([
        apiClient.request('/sos/helplines'),
        apiClient.request('/sos/contacts'),
      ]);
      
      setHelplines((helplinesRes as any).data || []);
      setContacts((contactsRes as any).data || []);
    } catch (error) {
      console.error('Failed to load SOS data:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerSOS = async (level: 'urge' | 'crisis') => {
    try {
      if (sessionId) apiClient.setSessionId(sessionId);
      await apiClient.request('/sos/trigger', {
        method: 'POST',
        body: JSON.stringify({ level, source: 'manual' }),
      });
      
      Alert.alert(
        'SOS Triggered',
        level === 'crisis' 
          ? 'Crisis support has been activated. Please reach out to emergency services if needed.'
          : 'Urge support has been activated. You\'re not alone in this.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Failed to trigger SOS:', error);
      Alert.alert('Error', 'Failed to trigger SOS. Please try again.');
    }
  };

  const callHelpline = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const textHelpline = (sms: string) => {
    Linking.openURL(`sms:${sms}`);
  };

  const openWebsite = (web: string) => {
    Linking.openURL(web);
  };

  const contactTrustedPerson = (contact: TrustedContact) => {
    if (contact.channel === 'phone') {
      Linking.openURL(`tel:${contact.value}`);
    } else if (contact.channel === 'sms') {
      Linking.openURL(`sms:${contact.value}`);
    } else if (contact.channel === 'email') {
      Linking.openURL(`mailto:${contact.value}`);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>SOS Support</Text>
        <Text variant="bodyLarge" style={[styles.loadingText, { color: theme.colors.onBackground }]}>Loading support resources...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
          SOS Support
        </Text>
        
        <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.onBackground }]}>
          You're not alone. Help is available 24/7.
        </Text>

        {/* Crisis Buttons */}
        <Card style={[styles.crisisCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleLarge" style={[styles.crisisTitle, { color: theme.colors.onSurface }]}>
              Need Immediate Help?
            </Text>
            
            <View style={styles.buttonContainer}>
              <Button 
                mode="contained" 
                style={[styles.crisisButton, { backgroundColor: theme.colors.error }]}
                onPress={() => triggerSOS('crisis')}
                icon="alert-circle"
                textColor={theme.colors.onError}
              >
                Crisis Support
              </Button>
              
              <Button 
                mode="contained" 
                style={[styles.urgeButton, { backgroundColor: theme.colors.secondary }]}
                onPress={() => triggerSOS('urge')}
                icon="heart"
                textColor={theme.colors.onSecondary}
              >
                Urge Support
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Helplines */}
        {helplines.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.cardTitle}>
                Professional Helplines
              </Text>
              
              {helplines.map((helpline, index) => (
                <View key={index} style={styles.helplineItem}>
                  <Text variant="titleMedium" style={styles.helplineName}>
                    {helpline.name}
                  </Text>
                  
                  <View style={styles.helplineActions}>
                    {helpline.phone && (
                      <Button 
                        mode="outlined" 
                        style={styles.actionButton}
                        onPress={() => callHelpline(helpline.phone!)}
                        icon="phone"
                      >
                        Call
                      </Button>
                    )}
                    
                    {helpline.sms && (
                      <Button 
                        mode="outlined" 
                        style={styles.actionButton}
                        onPress={() => textHelpline(helpline.sms!)}
                        icon="message"
                      >
                        Text
                      </Button>
                    )}
                    
                    {helpline.web && (
                      <Button 
                        mode="outlined" 
                        style={styles.actionButton}
                        onPress={() => openWebsite(helpline.web!)}
                        icon="web"
                      >
                        Website
                      </Button>
                    )}
                  </View>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Trusted Contacts */}
        {contacts.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.cardTitle}>
                Your Trusted Contacts
              </Text>
              
              {contacts.map((contact) => (
                <View key={contact.id} style={styles.contactItem}>
                  <View style={styles.contactInfo}>
                    <Text variant="titleMedium" style={styles.contactName}>
                      {contact.name}
                    </Text>
                    <Chip 
                      icon={contact.channel === 'phone' ? 'phone' : contact.channel === 'sms' ? 'message' : 'email'}
                      style={styles.contactChip}
                    >
                      {contact.channel.toUpperCase()}
                    </Chip>
                  </View>
                  
                  <Button 
                    mode="contained" 
                    style={styles.contactButton}
                    onPress={() => contactTrustedPerson(contact)}
                    icon="send"
                  >
                    Contact
                  </Button>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Grounding Exercises */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>
              Grounding Exercises
            </Text>
            
            <View style={styles.exerciseItem}>
              <Text variant="titleMedium" style={styles.exerciseTitle}>
                5-4-3-2-1 Technique
              </Text>
              <Text variant="bodyMedium" style={styles.exerciseDescription}>
                Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.
              </Text>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.exerciseItem}>
              <Text variant="titleMedium" style={styles.exerciseTitle}>
                Deep Breathing
              </Text>
              <Text variant="bodyMedium" style={styles.exerciseDescription}>
                Breathe in for 4 counts, hold for 4, out for 4. Repeat 5 times.
              </Text>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.exerciseItem}>
              <Text variant="titleMedium" style={styles.exerciseTitle}>
                Progressive Muscle Relaxation
              </Text>
              <Text variant="bodyMedium" style={styles.exerciseDescription}>
                Tense and release each muscle group from toes to head.
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Emergency Notice */}
        <Card style={styles.emergencyCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.emergencyTitle}>
              🚨 Emergency
            </Text>
            <Text variant="bodyLarge" style={styles.emergencyText}>
              If you're in immediate danger or having thoughts of self-harm, please call emergency services (911) or go to your nearest emergency room.
            </Text>
          </Card.Content>
        </Card>
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
  title: {
    color: '#60a5fa', // Light blue for dark theme
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#9ca3af', // Light gray for dark theme
    marginBottom: 24,
  },
  loadingText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 32,
  },
  crisisCard: {
    marginBottom: 16,
    backgroundColor: '#374151', // Dark gray card
    borderColor: '#4b5563',
    borderWidth: 1,
  },
  crisisTitle: {
    color: '#f87171', // Light red for dark theme
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  crisisButton: {
    flex: 1,
  },
  urgeButton: {
    flex: 1,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#1f2937', // Dark surface
  },
  cardTitle: {
    color: '#f9fafb', // Light text
    fontWeight: '600',
    marginBottom: 16,
  },
  helplineItem: {
    marginBottom: 16,
  },
  helplineName: {
    color: '#f9fafb',
    fontWeight: '600',
    marginBottom: 8,
  },
  helplineActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactName: {
    color: '#f9fafb',
    fontWeight: '600',
  },
  contactChip: {
    backgroundColor: '#374151', // Dark gray chip
  },
  contactButton: {
    backgroundColor: '#60a5fa', // Light blue for dark theme
  },
  exerciseItem: {
    marginBottom: 16,
  },
  exerciseTitle: {
    color: '#f9fafb',
    fontWeight: '600',
    marginBottom: 4,
  },
  exerciseDescription: {
    color: '#d1d5db', // Light gray text
    lineHeight: 20,
  },
  divider: {
    marginVertical: 8,
  },
  emergencyCard: {
    backgroundColor: '#374151', // Dark gray emergency card
    borderColor: '#4b5563',
    borderWidth: 1,
  },
  emergencyTitle: {
    color: '#f87171', // Light red for dark theme
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emergencyText: {
    color: '#fca5a5', // Light red text
    lineHeight: 22,
  },
});
