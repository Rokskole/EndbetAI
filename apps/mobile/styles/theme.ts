import { MD3DarkTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

export const theme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    // Primary colors
    primary: '#60a5fa', // Light blue
    onPrimary: '#000000',
    primaryContainer: '#1e3a8a',
    onPrimaryContainer: '#dbeafe',
    
    // Secondary colors
    secondary: '#34d399', // Light green
    onSecondary: '#000000',
    secondaryContainer: '#059669',
    onSecondaryContainer: '#d1fae5',
    
    // Tertiary colors
    tertiary: '#a78bfa', // Light purple
    onTertiary: '#000000',
    tertiaryContainer: '#7c3aed',
    onTertiaryContainer: '#ede9fe',
    
    // Surface colors
    surface: '#1f2937', // Dark gray
    onSurface: '#f9fafb', // Light text
    surfaceVariant: '#374151', // Slightly lighter gray
    onSurfaceVariant: '#d1d5db',
    
    // Background colors
    background: '#111827', // Very dark background
    onBackground: '#f9fafb', // Light text
    
    // Error colors
    error: '#f87171', // Light red
    onError: '#000000',
    errorContainer: '#dc2626',
    onErrorContainer: '#fef2f2',
    
    // Outline colors
    outline: '#4b5563', // Medium gray
    outlineVariant: '#6b7280', // Lighter gray
    
    // Additional dark theme colors
    surfaceDisabled: '#374151',
    onSurfaceDisabled: '#6b7280',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#f9fafb',
    inversePrimary: '#3b82f6',
  },
  roundness: 12,
};
