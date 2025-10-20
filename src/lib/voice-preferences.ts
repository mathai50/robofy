import { VoiceSettings } from '@/services/elevenLabsService';

// Extend Window interface for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface VoicePreferences {
  enabled: boolean;
  defaultVoiceId: string;
  defaultSettings: VoiceSettings['voiceSettings'];
  autoPlay: boolean;
  playbackSpeed: number;
  volume: number;
  language: string;
  voiceTones: Record<string, string>; // intent -> preferred voice tone
  accessibility: {
    highContrast: boolean;
    largerText: boolean;
    reducedMotion: boolean;
  };
  privacy: {
    allowVoiceDataCollection: boolean;
    storeAudioHistory: boolean;
  };
}

export interface VoiceAnalytics {
  totalVoiceInteractions: number;
  averageSessionDuration: number;
  preferredVoiceTone: string;
  mostUsedFeatures: string[];
  lastUsed: Date;
}

class VoicePreferencesManager {
  private static readonly STORAGE_KEY = 'robofy_voice_preferences';
  private static readonly ANALYTICS_KEY = 'robofy_voice_analytics';

  // Default voice preferences
  private static readonly DEFAULT_PREFERENCES: VoicePreferences = {
    enabled: false,
    defaultVoiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel
    defaultSettings: {
      stability: 0.5,
      similarity_boost: 0.8,
      style: 0.5,
      use_speaker_boost: true,
    },
    autoPlay: true,
    playbackSpeed: 1.0,
    volume: 0.8,
    language: 'en-US',
    voiceTones: {
      'pricing_inquiry': 'professional',
      'timeline_inquiry': 'enthusiastic',
      'service_inquiry': 'knowledgeable',
      'lead_generation': 'persuasive',
      'voice_inquiry': 'conversational',
      'repeat_request': 'patient',
      'general_inquiry': 'friendly'
    },
    accessibility: {
      highContrast: false,
      largerText: false,
      reducedMotion: false,
    },
    privacy: {
      allowVoiceDataCollection: true,
      storeAudioHistory: false,
    }
  };

  // Get user preferences
  static getPreferences(): VoicePreferences {
    if (typeof window === 'undefined') {
      return this.DEFAULT_PREFERENCES;
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...this.DEFAULT_PREFERENCES, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load voice preferences:', error);
    }

    return this.DEFAULT_PREFERENCES;
  }

  // Save user preferences
  static savePreferences(preferences: Partial<VoicePreferences>): void {
    if (typeof window === 'undefined') return;

    try {
      const current = this.getPreferences();
      const updated = { ...current, ...preferences };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));

      // Update analytics
      this.updateAnalytics({
        totalVoiceInteractions: (this.getAnalytics().totalVoiceInteractions || 0) + 1,
        lastUsed: new Date()
      });
    } catch (error) {
      console.error('Failed to save voice preferences:', error);
    }
  }

  // Get voice analytics
  static getAnalytics(): VoiceAnalytics {
    if (typeof window === 'undefined') {
      return {
        totalVoiceInteractions: 0,
        averageSessionDuration: 0,
        preferredVoiceTone: 'friendly',
        mostUsedFeatures: [],
        lastUsed: new Date()
      };
    }

    try {
      const stored = localStorage.getItem(this.ANALYTICS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load voice analytics:', error);
    }

    return {
      totalVoiceInteractions: 0,
      averageSessionDuration: 0,
      preferredVoiceTone: 'friendly',
      mostUsedFeatures: [],
      lastUsed: new Date()
    };
  }

  // Update analytics
  static updateAnalytics(updates: Partial<VoiceAnalytics>): void {
    if (typeof window === 'undefined') return;

    try {
      const current = this.getAnalytics();
      const updated = { ...current, ...updates };
      localStorage.setItem(this.ANALYTICS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to update voice analytics:', error);
    }
  }

  // Get preferred voice tone for intent
  static getPreferredVoiceTone(intent: string): string {
    const preferences = this.getPreferences();
    return preferences.voiceTones[intent] || 'friendly';
  }

  // Set preferred voice tone for intent
  static setPreferredVoiceTone(intent: string, tone: string): void {
    const preferences = this.getPreferences();
    preferences.voiceTones[intent] = tone;
    this.savePreferences({ voiceTones: preferences.voiceTones });
  }

  // Check if voice features are supported
  static isVoiceSupported(): boolean {
    if (typeof window === 'undefined') return false;

    return !!(
      window.MediaRecorder &&
      window.SpeechRecognition &&
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia
    );
  }

  // Get system capabilities
  static getSystemCapabilities(): {
    mediaRecorder: boolean;
    speechRecognition: boolean;
    audioPlayback: boolean;
    elevenLabsApi: boolean;
  } {
    if (typeof window === 'undefined') {
      return {
        mediaRecorder: false,
        speechRecognition: false,
        audioPlayback: false,
        elevenLabsApi: false
      };
    }

    return {
      mediaRecorder: !!window.MediaRecorder,
      speechRecognition: !!window.SpeechRecognition,
      audioPlayback: !!(window.HTMLAudioElement && new Audio().canPlayType),
      elevenLabsApi: !!process.env.ELEVENLABS_API_KEY
    };
  }

  // Reset preferences to default
  static resetPreferences(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.ANALYTICS_KEY);
    } catch (error) {
      console.error('Failed to reset voice preferences:', error);
    }
  }

  // Export preferences for backup
  static exportPreferences(): string {
    const preferences = this.getPreferences();
    const analytics = this.getAnalytics();

    return JSON.stringify({
      preferences,
      analytics,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }, null, 2);
  }

  // Import preferences from backup
  static importPreferences(data: string): boolean {
    try {
      const parsed = JSON.parse(data);

      if (parsed.preferences) {
        this.savePreferences(parsed.preferences);
      }

      if (parsed.analytics) {
        localStorage.setItem(this.ANALYTICS_KEY, JSON.stringify(parsed.analytics));
      }

      return true;
    } catch (error) {
      console.error('Failed to import voice preferences:', error);
      return false;
    }
  }
}

export default VoicePreferencesManager;