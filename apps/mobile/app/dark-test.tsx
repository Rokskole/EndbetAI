import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';

export default function DarkTestScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>
        Dark Theme Test
      </Text>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            This should be DARK
          </Text>
          <Text variant="bodyLarge" style={styles.cardText}>
            Background: #111827 (very dark)
          </Text>
          <Text variant="bodyLarge" style={styles.cardText}>
            Surface: #1f2937 (dark gray)
          </Text>
          <Text variant="bodyLarge" style={styles.cardText}>
            Text: #f9fafb (light)
          </Text>
        </Card.Content>
      </Card>

      <Button 
        mode="contained" 
        style={styles.button}
        onPress={() => console.log('Dark theme test button pressed')}
      >
        Test Button
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827', // Very dark background
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    color: '#f9fafb', // Light text
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#1f2937', // Dark surface
    marginBottom: 24,
  },
  cardTitle: {
    color: '#f9fafb', // Light text
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cardText: {
    color: '#f9fafb', // Light text
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#22c55e', // Light blue
  },
});
