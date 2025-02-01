export interface ChatMessage {
  sender: string;
  message: string;
  time: string;
  type?: string;
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
  type: 'local' | 'external'; // Adjust the type as needed
}

export interface ChatEvents {
  error: { message: string };
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