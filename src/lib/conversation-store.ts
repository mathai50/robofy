import { ConversationContext, AIResponse } from '@/services/aiService';

export interface VoiceState {
  isRecording: boolean;
  isPlaying: boolean;
  currentAudioUrl?: string;
  voiceEnabled: boolean;
  voiceSettings: {
    voiceId: string;
    autoPlay: boolean;
    playbackSpeed: number;
    volume: number;
  };
  audioQueue: string[];
  currentPlayingMessageId?: string;
}

export interface ConversationSession {
  sessionId: string;
  userId?: string;
  context: ConversationContext;
  voiceState?: VoiceState;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  leadCreated?: boolean;
  leadId?: string;
}

class ConversationStore {
  private sessions: Map<string, ConversationSession> = new Map();
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  // Create a new conversation session
  createSession(userId?: string): ConversationSession {
    const sessionId = this.generateSessionId();
    const session: ConversationSession = {
      sessionId,
      userId,
      context: {
        sessionId,
        userId,
        leadScore: 0,
        conversationHistory: [],
        extractedInfo: {}
      },
      voiceState: {
        isRecording: false,
        isPlaying: false,
        voiceEnabled: false,
        voiceSettings: {
          voiceId: '21m00Tcm4TlvDq8ikWAM', // Default to Rachel
          autoPlay: true,
          playbackSpeed: 1.0,
          volume: 0.8,
        },
        audioQueue: []
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  // Get an existing session
  getSession(sessionId: string): ConversationSession | undefined {
    const session = this.sessions.get(sessionId);

    if (!session) return undefined;

    // Check if session has expired
    if (Date.now() - session.updatedAt.getTime() > this.SESSION_TIMEOUT) {
      session.isActive = false;
      return undefined;
    }

    return session;
  }

  // Update a session with new conversation data
  updateSession(sessionId: string, aiResponse: AIResponse): ConversationSession | undefined {
    const session = this.sessions.get(sessionId);
    if (!session || !session.isActive) return undefined;

    session.context = aiResponse.conversationContext;
    session.updatedAt = new Date();

    this.sessions.set(sessionId, session);
    return session;
  }

  // Mark a session as having created a lead
  markLeadCreated(sessionId: string, leadId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    session.leadCreated = true;
    session.leadId = leadId;
    session.updatedAt = new Date();

    this.sessions.set(sessionId, session);
    return true;
  }

  // End/cleanup a session
  endSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    session.isActive = false;
    session.updatedAt = new Date();

    this.sessions.set(sessionId, session);
    return true;
  }

  // Get active sessions (for monitoring)
  getActiveSessions(): ConversationSession[] {
    const activeSessions: ConversationSession[] = [];
    const sessionsArray = Array.from(this.sessions.values());

    for (const session of sessionsArray) {
      if (session.isActive &&
          Date.now() - session.updatedAt.getTime() <= this.SESSION_TIMEOUT) {
        activeSessions.push(session);
      } else if (!session.isActive) {
        // Clean up inactive sessions
        this.sessions.delete(session.sessionId);
      }
    }

    return activeSessions;
  }

  // Get session statistics
  getStats(): {
    totalSessions: number;
    activeSessions: number;
    sessionsWithLeads: number;
    averageLeadScore: number;
  } {
    const sessions = Array.from(this.sessions.values());
    const activeSessions = sessions.filter(s => s.isActive);
    const sessionsWithLeads = sessions.filter(s => s.leadCreated);
    const averageLeadScore = sessionsWithLeads.length > 0
      ? sessionsWithLeads.reduce((sum, s) => sum + s.context.leadScore, 0) / sessionsWithLeads.length
      : 0;

    return {
      totalSessions: sessions.length,
      activeSessions: activeSessions.length,
      sessionsWithLeads: sessionsWithLeads.length,
      averageLeadScore: Math.round(averageLeadScore)
    };
  }

  // Clean up expired sessions
  cleanup(): number {
    let cleanedCount = 0;
    const now = Date.now();
    const entriesArray = Array.from(this.sessions.entries());

    for (const [sessionId, session] of entriesArray) {
      if (!session.isActive || now - session.updatedAt.getTime() > this.SESSION_TIMEOUT) {
        this.sessions.delete(sessionId);
        cleanedCount++;
      }
    }

    return cleanedCount;
  }

  // Voice state management methods
  updateVoiceState(sessionId: string, voiceState: Partial<VoiceState>): ConversationSession | undefined {
    const session = this.sessions.get(sessionId);
    if (!session || !session.isActive) return undefined;

    if (!session.voiceState) {
      session.voiceState = this.getDefaultVoiceState();
    }

    session.voiceState = { ...session.voiceState, ...voiceState } as VoiceState;
    session.updatedAt = new Date();

    this.sessions.set(sessionId, session);
    return session;
  }

  // Enable/disable voice for a session
  setVoiceEnabled(sessionId: string, enabled: boolean): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    if (!session.voiceState) {
      session.voiceState = this.getDefaultVoiceState();
    }

    session.voiceState.voiceEnabled = enabled;
    session.updatedAt = new Date();

    this.sessions.set(sessionId, session);
    return true;
  }

  // Update voice settings
  updateVoiceSettings(sessionId: string, settings: Partial<VoiceState['voiceSettings']>): boolean {
    const session = this.sessions.get(sessionId);
    if (!session || !session.voiceState) return false;

    session.voiceState.voiceSettings = { ...session.voiceState.voiceSettings, ...settings };
    session.updatedAt = new Date();

    this.sessions.set(sessionId, session);
    return true;
  }

  // Add audio to playback queue
  queueAudio(sessionId: string, audioUrl: string, messageId?: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session || !session.voiceState) return false;

    session.voiceState.audioQueue.push(audioUrl);
    if (messageId) {
      session.voiceState.currentPlayingMessageId = messageId;
    }
    session.updatedAt = new Date();

    this.sessions.set(sessionId, session);
    return true;
  }

  // Remove audio from queue
  dequeueAudio(sessionId: string): string | undefined {
    const session = this.sessions.get(sessionId);
    if (!session || !session.voiceState) return undefined;

    const audioUrl = session.voiceState.audioQueue.shift();
    if (session.voiceState.audioQueue.length === 0) {
      session.voiceState.currentPlayingMessageId = undefined;
    }
    session.updatedAt = new Date();

    this.sessions.set(sessionId, session);
    return audioUrl;
  }

  // Get current voice state
  getVoiceState(sessionId: string): VoiceState | undefined {
    const session = this.sessions.get(sessionId);
    return session?.voiceState;
  }

  private getDefaultVoiceState(): VoiceState {
    return {
      isRecording: false,
      isPlaying: false,
      voiceEnabled: false,
      voiceSettings: {
        voiceId: '21m00Tcm4TlvDq8ikWAM',
        autoPlay: true,
        playbackSpeed: 1.0,
        volume: 0.8,
      },
      audioQueue: []
    };
  }

  private generateSessionId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // For development/testing - reset all sessions
  reset(): void {
    this.sessions.clear();
  }
}

// Export singleton instance
export const conversationStore = new ConversationStore();

// Cleanup expired sessions every 5 minutes
setInterval(() => {
  conversationStore.cleanup();
}, 5 * 60 * 1000);

export default conversationStore;