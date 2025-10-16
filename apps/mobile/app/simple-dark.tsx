import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';

export default function SimpleDarkScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>DARK THEME TEST</Text>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>This is DARK!</Text>
          <Text style={styles.cardText}>Background: #111827</Text>
          <Text style={styles.cardText}>Surface: #1f2937</Text>
          <Text style={styles.cardText}>Text: #f9fafb</Text>
        </Card.Content>
      </Card>

      <Button 
        style={styles.button}
        onPress={() => console.log('Dark theme working!')}
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#1f2937', // Dark surface
    marginBottom: 24,
  },
  cardTitle: {
    color: '#f9fafb', // Light text
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cardText: {
    color: '#f9fafb', // Light text
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#60a5fa', // Light blue
  },
});
