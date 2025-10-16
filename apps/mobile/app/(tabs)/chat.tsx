import { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, FlatList, TextInput as RNTextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Text, ActivityIndicator, IconButton, Card, Button, FAB } from 'react-native-paper';
import { useAuth } from '@/features/auth/AuthProvider';
import { apiClient } from '@/lib/apiClient';
import { useRouter } from 'expo-router';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at?: string;
};

export default function ChatScreen() {
  const { sessionId } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const inputRef = useRef<RNTextInput>(null);

  useEffect(() => {
    if (sessionId) apiClient.setSessionId(sessionId);
  }, [sessionId]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient.getMessages(50);
        if (!mounted) return;
        setMessages((res as any).data || []);
        scrollToEnd();
      } catch (e) {
        // noop
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const canSend = useMemo(() => input.trim().length > 0 && !isSending, [input, isSending]);

  const scrollToEnd = () => {
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  };

  const handleSend = async () => {
    if (!canSend) return;
    const text = input.trim();
    setInput('');
    setIsSending(true);
    // optimistic update for user message
    const tempId = `temp-${Date.now()}`;
    const optimisticUser: ChatMessage = { id: tempId, role: 'user', content: text };
    setMessages(prev => [...prev, optimisticUser]);
    scrollToEnd();
    try {
      const res = await apiClient.sendMessage(text);
      const data = (res as any).data;
      // replace optimistic user message with server version and add assistant
      setMessages(prev => {
        const withoutTemp = prev.filter(m => m.id !== tempId);
        const userMsg: ChatMessage = data.user;
        const assistantMsg: ChatMessage = data.assistant;
        return [...withoutTemp, userMsg, assistantMsg];
      });
      scrollToEnd();
    } catch (e) {
      // rollback optimistic user message on error
      setMessages(prev => prev.filter(m => m.id !== tempId));
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const handleCrisisSupport = () => {
    Alert.alert(
      'Crisis Support',
      'If you\'re in immediate danger or having thoughts of self-harm, please reach out for help now.',
      [
        { text: 'Call 911', onPress: () => {/* TODO: Implement call functionality */} },
        { text: 'Crisis Resources', onPress: () => router.push('/crisis-support') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleSOS = () => {
    router.push('/sos');
  };

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.row, isUser ? styles.rowEnd : styles.rowStart]}>
        <Card style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
          <Card.Content>
            <Text style={isUser ? styles.userText : styles.assistantText}>{item.content}</Text>
          </Card.Content>
        </Card>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading messages…</Text>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={scrollToEnd}
        />
      )}

      {/* Crisis Support Buttons */}
      <View style={styles.crisisButtons}>
        <Button
          mode="contained"
          style={styles.crisisButton}
          onPress={handleCrisisSupport}
          icon="alert-circle"
        >
          Crisis Support
        </Button>
        <Button
          mode="outlined"
          style={styles.sosButton}
          onPress={handleSOS}
          icon="heart"
        >
          SOS Help
        </Button>
      </View>

      <View style={styles.composer}>
        <RNTextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Write a message…"
          value={input}
          onChangeText={setInput}
          editable={!isSending}
          multiline
        />
        <IconButton icon="send" onPress={handleSend} disabled={!canSend} style={styles.sendBtn} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827' }, // Dark background
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: '#9ca3af' }, // Light gray for dark theme
  listContent: { padding: 12, paddingBottom: 96 },
  row: { flexDirection: 'row', marginVertical: 6 },
  rowStart: { justifyContent: 'flex-start' },
  rowEnd: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '85%', borderRadius: 16 },
  assistantBubble: { backgroundColor: '#1f2937' }, // Dark surface
  userBubble: { backgroundColor: '#60a5fa' }, // Light blue for dark theme
  assistantText: { color: '#f9fafb' }, // Light text
  userText: { color: '#000000' }, // Dark text on light background
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#1f2937', // Dark surface
    borderTopWidth: 1,
    borderTopColor: '#4b5563', // Dark border
  },
  input: {
    flex: 1,
    maxHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#374151', // Dark gray input
    borderRadius: 12,
    color: '#f9fafb', // Light text
  },
  sendBtn: { marginLeft: 4 },
  crisisButtons: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    backgroundColor: '#1f2937',
    borderTopWidth: 1,
    borderTopColor: '#4b5563',
  },
  crisisButton: {
    flex: 1,
    backgroundColor: '#dc2626',
  },
  sosButton: {
    flex: 1,
    borderColor: '#60a5fa',
  },
});
