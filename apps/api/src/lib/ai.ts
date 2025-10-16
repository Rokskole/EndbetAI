import axios from 'axios';
import { config } from '@packages/config';

export interface AiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function generateAssistantReply(messages: AiMessage[]): Promise<string> {
  if (!config.features.enableAiChat) {
    return 'AI chat is disabled in this environment.';
  }

  if (!config.ai.deepseekApiKey) {
    return 'DeepSeek API key missing. Please configure DEEPSEEK_API_KEY.';
  }

  try {
    const resp = await axios.post(
      `${config.ai.deepseekBaseUrl}/v1/chat/completions`,
      {
        model: 'deepseek-chat',
        messages,
        temperature: 0.7,
        max_tokens: 400,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.ai.deepseekApiKey}`,
        },
        timeout: 20000,
      }
    );

    const text = resp.data?.choices?.[0]?.message?.content || '';
    return text.trim() || 'I am here with you. How can I help right now?';
  } catch (error: any) {
    console.error('DeepSeek error:', error?.response?.data || error?.message);
    return 'I had trouble reaching the AI service. Let\'s try a grounding exercise together: take 3 slow breaths.';
  }
}

// Crisis detection system
export interface CrisisDetectionResult {
  isCrisis: boolean;
  isUrge: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'crisis';
  detectedKeywords: string[];
  suggestedAction: string;
}

export function detectCrisisAndUrge(content: string): CrisisDetectionResult {
  const text = content.toLowerCase();
  
  // Crisis keywords (self-harm, suicide)
  const crisisKeywords = [
    'kill myself', 'end it all', 'not worth living', 'want to die',
    'suicide', 'hurt myself', 'no point', 'give up', 'hopeless', 'worthless'
  ];
  
  // Urge keywords (gambling urges)
  const urgeKeywords = [
    'want to bet', 'need to gamble', 'place a bet', 'play slots',
    'go to casino', 'online gambling', 'just one more', 'can\'t stop',
    'gambling urge', 'betting urge'
  ];
  
  const detectedCrisis = crisisKeywords.filter(keyword => text.includes(keyword));
  const detectedUrge = urgeKeywords.filter(keyword => text.includes(keyword));
  
  const isCrisis = detectedCrisis.length > 0;
  const isUrge = detectedUrge.length > 0;
  
  let riskLevel: 'low' | 'medium' | 'high' | 'crisis' = 'low';
  let suggestedAction = '';
  
  if (isCrisis) {
    riskLevel = 'crisis';
    suggestedAction = 'immediate_crisis_support';
  } else if (isUrge) {
    riskLevel = 'high';
    suggestedAction = 'urge_support';
  } else if (text.includes('struggling') || text.includes('difficult')) {
    riskLevel = 'medium';
    suggestedAction = 'general_support';
  }
  
  return {
    isCrisis,
    isUrge,
    riskLevel,
    detectedKeywords: [...detectedCrisis, ...detectedUrge],
    suggestedAction
  };
}

// Generate crisis-aware response
export function generateCrisisResponse(detection: CrisisDetectionResult, originalContent: string): string {
  if (detection.isCrisis) {
    return `I'm really concerned about what you're sharing. If you're thinking about harming yourself, please reach out for immediate help right now. You can call a crisis helpline or emergency services. You're not alone, and there are people who want to help you through this.`;
  }
  
  if (detection.isUrge) {
    return `I can hear that you're having strong urges right now. That's really tough, and I'm glad you reached out. Let's try a quick grounding technique: take 5 deep breaths, then tell me what you're feeling in this moment. We can work through this together.`;
  }
  
  return ''; // Let AI generate normal response
}


