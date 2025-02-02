export interface ChatMessage {
  type: 'message';
  content: string;
  messageType: 'text' | 'voice';
  timestamp: string;
  sender: string;
  agent: string;
}

export interface ChatState {
  isMuted: boolean;
  showHistory: boolean;
  message: string;
  chatHistory: ChatMessage[];
}

export interface Agent {
  id: string;
  name: string;
  type: 'local' | 'remote';
}

export interface WebSocketMessage {
  type: 'message' | 'status';
  message?: ChatMessage;
  isProcessing?: boolean;
}

export interface ChatEvents {
  error: {
    message: string;
    reason?: string;
  };
  agentSwitch: { agent: Agent };
  messageSent: { content: string; type: string; timestamp: string; agent: string };
  mute: { isMuted: boolean };
  volumeChange: { volume: number };
  fileUpload: { file: File };
  voiceAssistant: { isActive: boolean };
  utilitiesClick: void;
}

export interface VoiceState {
  isListening: boolean;
  isMuted: boolean;
  volume: number;
}

// Chat-related utility functions can be added here
export function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString();
}

export function isValidMessage(message: unknown): message is ChatMessage {
  if (typeof message !== 'object' || message === null) return false;
  const msg = message as Partial<ChatMessage>;
  return (
    msg.type === 'message' &&
    typeof msg.content === 'string' &&
    (msg.messageType === 'text' || msg.messageType === 'voice') &&
    typeof msg.timestamp === 'string' &&
    typeof msg.sender === 'string' &&
    typeof msg.agent === 'string'
  );
} 