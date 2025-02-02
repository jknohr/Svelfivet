import type { FlowClient as SpeechmaticsFlowClient } from '@speechmatics/flow-client';
import type { TelnyxRTC } from '@telnyx/webrtc';
import type Surreal from 'surrealdb.js';

/***************************************************************************
 * Types & Interfaces
 ***************************************************************************/

// Example call interface with immutable properties
export interface Call {
  id: string;
  callerId: string;
  duration: number;
  status: 'active' | 'ended' | 'failed';
  connectedToSpeechmatics: boolean;
  muted: boolean;
  transcription: string[];
}

// Configuration for Speechmatics Flow with required fields
export interface SpeechmaticsFlowConfig {
  readonly flowId: string;
  readonly flowName: string;
  readonly apiKey: string;
}

// Example type for Telnyx number management
export interface TelnyxNumber {
  readonly id: string;
  readonly phoneNumber: string;
  status: string;
}

// Event types for better type safety
export type CallEvent = {
  callStarted: { call: Call };
  callUpdated: { call: Call };
  callEnded: { callId: string };
  transcriptionStart: { callId: string };
  transcriptionUpdate: { callId: string; text: string };
  transcriptionEnd: { callId: string };
  keywordDetected: { callId: string; keyword: string };
  error: { message: string };
};

export type CallsideEventHandler = {
  onCallStart?: (call: Call) => void;
  onCallEnd?: (callId: string) => void;
  onError?: (message: string) => void;
  onTranscriptionUpdate?: (callId: string, text: string) => void;
};

// Add snapshot types
export type StateSnapshot = {
    calls: Call[];
    numbers: TelnyxNumber[];
    config: SpeechmaticsFlowConfig | null;
    error: string | null;
    settings: SettingsConfig;
    clients: Clients;
};

export type SnapshotMetadata = {
    timestamp: number;
    version: string;
    userId: string;
};

export type SurrealStateRecord = {
    id: string;
    data: StateSnapshot;
    metadata: SnapshotMetadata;
};

// Add Settings interface
export interface SettingsConfig {
    telnyxLogin: string;
    telnyxPassword: string;
    surrealDbUrl: string;
    surrealDbUser: string;
    surrealDbPass: string;
    speechmaticsApiKey: string;
    speechmaticsLanguage: string;
    speechmaticsModel: string;
}

// Add validation types
export type ValidationError = {
    field: string;
    message: string;
};

export type ValidationResult = {
    valid: boolean;
    errors: ValidationError[];
};

// Add strict settings validation
export type RequiredSettings = {
    telnyxLogin: string;
    telnyxPassword: string;
    speechmaticsApiKey: string;
};

export type OptionalSettings = {
    surrealDbUrl?: string;
    surrealDbUser?: string;
    surrealDbPass?: string;
    speechmaticsLanguage?: string;
    speechmaticsModel?: string;
};

export type Settings = RequiredSettings & OptionalSettings;

// Add FlowClient interface
export interface SpeechmaticsClient {
    startSession(config: TranscriptionConfig): Promise<void>;
    endSession(): Promise<void>;
    initialize(config: TranscriptionConfig): Promise<void>;
}

// Move Clients interface before GlobalState
export interface Clients {
    speechmatics: SpeechmaticsClient | null;
    telnyx: TelnyxRTC | null;
    db: Surreal | null;
}

// State interface for global state management
export interface GlobalState extends StateSnapshot {
    settings: {
        surrealDbUrl: string;  // Remove undefined from type
        telnyxLogin: string;
        telnyxPassword: string;
        speechmaticsApiKey: string;
        speechmaticsLanguage: string;
        speechmaticsModel: string;
        surrealDbUser: string;
        surrealDbPass: string;
    };
}

// Flow configuration types
export interface FlowConfig {
    id: string;
    name: string;
    type: string;
    flowId?: string;
    flowName?: string;
}

// Audio stream types
export interface AudioStreamConfig {
    sampleRate: number;
    channels: number;
    format: 'pcm' | 'opus';
}

export interface TranscriptionConfig {
    language: string;
    model: string;
}

// Add strict event types
export type ServiceEvent = {
    type: 'init' | 'error' | 'ready' | 'disconnect';
    service: keyof Clients;
    timestamp: number;
    error?: string;
};

export interface FlowClientInterface {
    initialize(config: TranscriptionConfig): Promise<void>;
    disconnect(): void;
}

interface ErrorState {
    timestamp: string;  // Keep only one timestamp declaration
    error: Error;      // Fix error property type
}
