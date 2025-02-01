import type { Agent } from '$lib/components/Templates/Canvas/types/context';
import type { ContextType } from '$lib/components/Templates/Canvas/types/context';

export interface ChatEvents {
  error: { message: string };
  agentSwitch: { agent: Agent };
  agentMessage: { message: string };
  agentMessageReceived: { message: string };
  agentMessageSent: { message: string };
  agentMessageError: { error: string };
  agentMessageSuccess: { message: string };
  agentMessageWarning: { warning: string };
  agentMessageInfo: { info: string };
  agentMessageDebug: { debug: string };
  userMessage: { message: string };
  userMessageReceived: { message: string };
  userMessageSent: { message: string };
  userMessageError: { error: string };
  userMessageSuccess: { message: string };
  userMessageWarning: { warning: string };
  userMessageInfo: { info: string };
  userMessageDebug: { debug: string };
  networkError: { error: string };
  contextSwitch: { context: ContextType };
  voiceAssistant: { isActive: boolean };
  voiceAssistantError: { error: string };
  voiceAssistantSuccess: { message: string };
  voiceAssistantWarning: { warning: string };
  voiceAssistantInfo: { info: string };
  voiceAssistantDebug: { debug: string };
  // other events...
} 

export interface ChatMessage {
  type: 'message';
  content: string;
  messageType: 'text' | 'voice';
  timestamp: string;
  agent: string;
  sender?: string;
  time?: string;
}

export interface ChatHistory {
  messages: ChatMessage[];
  timestamp: number;
}

export interface ChatVoiceState {
  isActive: boolean;
  isMuted: boolean;
  volume: number;
}

export interface ChatAgent {
  id: string;
  name: string;
  description: string;
}

export interface Agent {
  id: string;
  name: string;
  type: 'local' | 'remote';
  capabilities?: string[];
}

export interface VoiceState {
  isListening: boolean;
  isMuted: boolean;
  volume: number;
}

export interface ChatState {
  showHistory: boolean;
  message: string;
  chatHistory: ChatMessage[];
  isProcessing: boolean;
  isVoiceActive: boolean;
  currentAgent: Agent;
}

export interface VoiceChatState {
  mediaRecorder: MediaRecorder | null;
  audioChunks: Blob[];
  voiceState: VoiceState;
}

export interface WebSocketState {
  ws: WebSocket | null;
}

export interface WebSocketMessage {
  type: string;
  message?: ChatMessage;
  isProcessing?: boolean;
  data?: any;
}

export interface WebSocketError extends Error {
  code?: number;
  reason?: string;
}