import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function SimpleIndexScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QuitBet AI</Text>
      <Text style={styles.subtitle}>Dark Theme Test</Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          style={styles.button}
          onPress={() => router.push('/simple-dark')}
        >
          Test Dark Theme
        </Button>
        
        <Button 
          style={styles.crisisButton}
          onPress={() => router.push('/crisis-dark')}
        >
          Crisis Support
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827', // Very dark background
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#f9fafb', // Light text
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    color: '#d1d5db', // Light gray text
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    backgroundColor: '#22c55e', // Light blue
    paddingVertical: 8,
  },
  crisisButton: {
    backgroundColor: '#dc2626', // Red
    paddingVertical: 8,
  },
});
