import { businessKnowledge } from '@/lib/business-knowledge';

export interface VoiceSettings {
  voiceId: string;
  model: 'eleven_monolingual_v1' | 'eleven_multilingual_v1' | 'eleven_turbo_v1';
  voiceSettings: {
    stability: number;
    similarity_boost: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
  language?: string;
}

export interface AudioData {
  audioUrl: string;
  duration?: number;
  format: 'mp3' | 'wav';
}

export interface SpeechToTextResult {
  text: string;
  confidence: number;
  language?: string;
}

class ElevenLabsService {
  private apiKey: string | null = null;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor(apiKey?: string) {
    const key = apiKey || process.env.ELEVENLABS_API_KEY || process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;

    if (!key) {
      console.warn('ElevenLabs API key not found. Voice features will be disabled.');
      return;
    }

    this.apiKey = key;
  }

  /**
   * Convert text to speech using ElevenLabs API
   */
  async textToSpeech(text: string, voiceSettings: VoiceSettings): Promise<AudioData> {
    if (!this.apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceSettings.voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: voiceSettings.model,
          voice_settings: voiceSettings.voiceSettings,
        }),
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      return {
        audioUrl,
        format: 'mp3',
      };
    } catch (error) {
      console.error('Error in text-to-speech:', error);
      throw error;
    }
  }

  /**
   * Convert speech to text using ElevenLabs API
   */
  async speechToText(audioBlob: Blob, language?: string): Promise<SpeechToTextResult> {
    if (!this.apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');
      if (language) {
        formData.append('language_code', language);
      }

      const response = await fetch(`${this.baseUrl}/speech-to-text`, {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs STT API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      return {
        text: result.text,
        confidence: result.confidence || 0.8,
        language: result.language || language,
      };
    } catch (error) {
      console.error('Error in speech-to-text:', error);
      throw error;
    }
  }

  /**
   * Get available voices from ElevenLabs
   */
  async getVoices(): Promise<any[]> {
    if (!this.apiKey) {
      return this.getFallbackVoices();
    }

    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.status}`);
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      console.error('Error fetching voices:', error);
      return this.getFallbackVoices();
    }
  }

  /**
   * Get voice recommendations based on business context
   */
  getVoiceRecommendations(): VoiceSettings[] {
    return [
      {
        voiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel (professional, friendly)
        model: 'eleven_multilingual_v1',
        voiceSettings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.5,
          use_speaker_boost: true,
        },
        language: 'en-US',
      },
      {
        voiceId: 'AZnzlk1XvdvUeBnXmlld', // Domi (warm, engaging)
        model: 'eleven_multilingual_v1',
        voiceSettings: {
          stability: 0.4,
          similarity_boost: 0.9,
          style: 0.6,
          use_speaker_boost: true,
        },
        language: 'en-US',
      },
      {
        voiceId: 'EXAVITQu4vr4xnSDxMaL', // Bella (clear, professional)
        model: 'eleven_multilingual_v1',
        voiceSettings: {
          stability: 0.6,
          similarity_boost: 0.7,
          style: 0.4,
          use_speaker_boost: true,
        },
        language: 'en-US',
      },
    ];
  }

  /**
   * Generate voice-aware business response
   */
  generateVoiceResponse(message: string, context: any): string {
    // Enhance responses for voice delivery
    const enhancedMessage = this.enhanceForVoice(message);

    // Add appropriate pauses and emphasis for business context
    return this.addVoiceAnnotations(enhancedMessage, context);
  }

  private enhanceForVoice(message: string): string {
    // Add natural pauses after questions
    let enhanced = message.replace(/\?+/g, '? <break time="300ms" />');

    // Add pauses after important business points
    enhanced = enhanced.replace(/(\d+[k%]\b)/g, '$1 <break time="200ms" />');

    // Emphasize key business terms
    const businessTerms = ['website', 'leads', 'ROI', 'marketing', 'automation', 'conversion'];
    businessTerms.forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      enhanced = enhanced.replace(regex, `<emphasis level="moderate">${term}</emphasis>`);
    });

    return enhanced;
  }

  private addVoiceAnnotations(message: string, context: any): string {
    // Add context-specific voice styling
    if (context.intent === 'pricing_inquiry') {
      return `<prosody rate="95%" pitch="0%">` + message + `</prosody>`;
    }

    if (context.intent === 'timeline_inquiry') {
      return `<prosody rate="90%" pitch="+5%">` + message + `</prosody>`;
    }

    return `<prosody rate="100%" pitch="0%">` + message + `</prosody>`;
  }

  private getFallbackVoices(): any[] {
    return [
      { voice_id: 'rachel', name: 'Rachel (Professional)', category: 'professional' },
      { voice_id: 'domi', name: 'Domi (Warm)', category: 'conversational' },
      { voice_id: 'bella', name: 'Bella (Clear)', category: 'professional' },
    ];
  }

  /**
   * Process audio for conversation context
   */
  processAudioForContext(audioBlob: Blob): Promise<{
    transcript?: string;
    sentiment?: 'positive' | 'negative' | 'neutral';
    confidence?: number;
  }> {
    // This would integrate with speech analysis for sentiment and context
    return Promise.resolve({
      sentiment: 'neutral',
      confidence: 0.8,
    });
  }
}

export const elevenLabsService = new ElevenLabsService();
export default elevenLabsService;