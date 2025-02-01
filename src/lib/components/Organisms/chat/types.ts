export interface Conversation {
  id: string;
  userId: string;
  providerId: string;
  timestamp: string;
  transcript?: string;
  response?: string;
}

export interface Message {
  content: string;
  isResponse: boolean;
  timestamp: Date;
  providerId: string;
  platform: string;
}

export interface ChatProps {
  platform?: string;
  userId: string;
  namespace: string;
  children?: any;
} 