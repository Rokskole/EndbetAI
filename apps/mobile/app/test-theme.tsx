import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button, useTheme } from 'react-native-paper';

export default function TestThemeScreen() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.primary }]}>
        Dark Theme Test
      </Text>
      
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text variant="titleLarge" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
            Theme Colors Test
          </Text>
          <Text variant="bodyLarge" style={[styles.cardText, { color: theme.colors.onSurface }]}>
            Background: {theme.colors.background}
          </Text>
          <Text variant="bodyLarge" style={[styles.cardText, { color: theme.colors.onSurface }]}>
            Surface: {theme.colors.surface}
          </Text>
          <Text variant="bodyLarge" style={[styles.cardText, { color: theme.colors.primary }]}>
            Primary: {theme.colors.primary}
          </Text>
          <Text variant="bodyLarge" style={[styles.cardText, { color: theme.colors.secondary }]}>
            Secondary: {theme.colors.secondary}
          </Text>
        </Card.Content>
      </Card>

      <Button 
        mode="contained" 
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={() => console.log('Theme test button pressed')}
      >
        Test Button
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 24,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cardText: {
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
  },
});
