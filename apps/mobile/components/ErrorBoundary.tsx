import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button, Card } from 'react-native-paper';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to crash reporting service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with crash reporting service (e.g., Sentry, Bugsnag)
      console.error('Error caught by boundary:', error, errorInfo);
    } else {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.content}>
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.title}>Something went wrong</Text>
                <Text style={styles.message}>
                  We're sorry, but something unexpected happened. Please try again.
                </Text>

                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorTitle}>Error Details (Development Only):</Text>
                    <Text style={styles.errorText}>{this.state.error.toString()}</Text>
                    {this.state.errorInfo && (
                      <Text style={styles.errorText}>
                        {this.state.errorInfo.componentStack}
                      </Text>
                    )}
                  </View>
                )}

                <View style={styles.buttonContainer}>
                  <Button
                    mode="contained"
                    onPress={this.handleReset}
                    style={styles.button}
                  >
                    Try Again
                  </Button>
                </View>

                <Text style={styles.helpText}>
                  If this problem persists, please contact support.
                </Text>
              </Card.Content>
            </Card>
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#1f2937',
    borderColor: '#4b5563',
    borderWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f9fafb',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#d1d5db',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  errorContainer: {
    marginTop: 16,
    marginBottom: 24,
    padding: 12,
    backgroundColor: '#374151',
    borderRadius: 8,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f87171',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#9ca3af',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 16,
  },
  button: {
    backgroundColor: '#22c55e',
  },
  helpText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
});

