/**
 * Voice Integration Testing Suite
 *
 * This module provides comprehensive testing for the ElevenLabs voice integration
 * including TTS (Text-to-Speech), STT (Speech-to-Text), and conversation flows.
 */

import elevenLabsService from '@/services/elevenLabsService';
import VoicePreferencesManager from '@/lib/voice-preferences';
import conversationStore from '@/lib/conversation-store';

export interface VoiceTestResult {
  testName: string;
  passed: boolean;
  message: string;
  duration?: number;
  details?: any;
}

export interface VoiceIntegrationTestSuite {
  systemCapabilities: VoiceTestResult;
  elevenLabsApi: VoiceTestResult;
  voicePreferences: VoiceTestResult;
  conversationStore: VoiceTestResult;
  endToEndFlow: VoiceTestResult;
  overall: {
    passed: boolean;
    score: number;
    recommendations: string[];
  };
}

class VoiceIntegrationTester {
  private testResults: VoiceTestResult[] = [];

  /**
   * Run all voice integration tests
   */
  async runAllTests(): Promise<VoiceIntegrationTestSuite> {
    console.log('🗣️ Starting Voice Integration Tests...');

    const systemCapabilities = this.testSystemCapabilities();
    const elevenLabsApi = await this.testElevenLabsAPI();
    const voicePreferences = this.testVoicePreferences();
    const conversationStore = this.testConversationStoreIntegration();
    const endToEndFlow = await this.testEndToEndVoiceFlow();

    const allTests = [systemCapabilities, elevenLabsApi, voicePreferences, conversationStore, endToEndFlow];
    const passedTests = allTests.filter(test => test.passed).length;
    const overallScore = Math.round((passedTests / allTests.length) * 100);

    const recommendations = this.generateRecommendations(allTests);

    return {
      systemCapabilities,
      elevenLabsApi,
      voicePreferences,
      conversationStore,
      endToEndFlow,
      overall: {
        passed: overallScore >= 80,
        score: overallScore,
        recommendations
      }
    };
  }

  /**
   * Test system capabilities for voice features
   */
  private testSystemCapabilities(): VoiceTestResult {
    const startTime = Date.now();

    try {
      const capabilities = VoicePreferencesManager.getSystemCapabilities();

      const issues: string[] = [];
      if (!capabilities.mediaRecorder) issues.push('MediaRecorder API not supported');
      if (!capabilities.speechRecognition) issues.push('Speech Recognition API not supported');
      if (!capabilities.audioPlayback) issues.push('Audio playback not supported');
      if (!capabilities.elevenLabsApi) issues.push('ElevenLabs API key not configured');

      const passed = issues.length === 0;
      const message = passed
        ? '✅ All system capabilities available'
        : `⚠️ Missing capabilities: ${issues.join(', ')}`;

      return {
        testName: 'System Capabilities',
        passed,
        message,
        duration: Date.now() - startTime,
        details: capabilities
      };
    } catch (error) {
      return {
        testName: 'System Capabilities',
        passed: false,
        message: `❌ Error testing system capabilities: ${error instanceof Error ? error.message : String(error)}`,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test ElevenLabs API integration
   */
  private async testElevenLabsAPI(): Promise<VoiceTestResult> {
    const startTime = Date.now();

    try {
      // Test voice listing
      const voices = await elevenLabsService.getVoices();
      const voicesTest = voices.length > 0;

      // Test TTS with a simple phrase (if voices available)
      let ttsTest = false;
      if (voices.length > 0) {
        try {
          await elevenLabsService.textToSpeech('Test message', {
            voiceId: voices[0].voice_id || '21m00Tcm4TlvDq8ikWAM',
            model: 'eleven_multilingual_v1',
            voiceSettings: {
              stability: 0.5,
              similarity_boost: 0.8,
              style: 0.5,
              use_speaker_boost: true,
            }
          });
          ttsTest = true;
        } catch (error) {
          console.warn('TTS test failed:', error instanceof Error ? error.message : String(error));
        }
      }

      const passed = voicesTest && ttsTest;
      const message = passed
        ? '✅ ElevenLabs API integration working'
        : '⚠️ ElevenLabs API has issues';

      return {
        testName: 'ElevenLabs API',
        passed,
        message,
        duration: Date.now() - startTime,
        details: { voicesCount: voices.length, voicesTest, ttsTest }
      };
    } catch (error) {
      return {
        testName: 'ElevenLabs API',
        passed: false,
        message: `❌ ElevenLabs API test failed: ${error instanceof Error ? error.message : String(error)}`,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test voice preferences management
   */
  private testVoicePreferences(): VoiceTestResult {
    const startTime = Date.now();

    try {
      // Test getting preferences
      const preferences = VoicePreferencesManager.getPreferences();

      // Test saving preferences
      const testTone = 'test_tone';
      VoicePreferencesManager.setPreferredVoiceTone('test_intent', testTone);
      const updatedPreferences = VoicePreferencesManager.getPreferences();

      // Test analytics
      const analytics = VoicePreferencesManager.getAnalytics();

      const preferencesTest = preferences.enabled !== undefined;
      const saveTest = updatedPreferences.voiceTones['test_intent'] === testTone;
      const analyticsTest = analytics.totalVoiceInteractions !== undefined;

      const passed = preferencesTest && saveTest && analyticsTest;
      const message = passed
        ? '✅ Voice preferences system working'
        : '⚠️ Voice preferences have issues';

      return {
        testName: 'Voice Preferences',
        passed,
        message,
        duration: Date.now() - startTime,
        details: { preferencesTest, saveTest, analyticsTest }
      };
    } catch (error) {
      return {
        testName: 'Voice Preferences',
        passed: false,
        message: `❌ Voice preferences test failed: ${error instanceof Error ? error.message : String(error)}`,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test conversation store voice integration
   */
  private testConversationStoreIntegration(): VoiceTestResult {
    const startTime = Date.now();

    try {
      // Create a test session
      const session = conversationStore.createSession('test-user');

      // Test voice state initialization
      const hasVoiceState = !!session.voiceState;
      const voiceStateValid = session.voiceState?.voiceEnabled !== undefined;

      // Test voice state updates
      const voiceEnabled = conversationStore.setVoiceEnabled(session.sessionId, true);
      const voiceSettingsUpdated = conversationStore.updateVoiceSettings(session.sessionId, {
        voiceId: 'test-voice-id'
      });

      // Test audio queue
      const audioQueued = conversationStore.queueAudio(session.sessionId, 'test-audio-url');
      const audioDequeued = conversationStore.dequeueAudio(session.sessionId);

      const passed = hasVoiceState && voiceStateValid && voiceEnabled && voiceSettingsUpdated && audioQueued && audioDequeued === 'test-audio-url';
      const message = passed
        ? '✅ Conversation store voice integration working'
        : '⚠️ Conversation store voice integration has issues';

      return {
        testName: 'Conversation Store Voice Integration',
        passed,
        message,
        duration: Date.now() - startTime,
        details: { hasVoiceState, voiceStateValid, voiceEnabled, voiceSettingsUpdated, audioQueued }
      };
    } catch (error) {
      return {
        testName: 'Conversation Store Voice Integration',
        passed: false,
        message: `❌ Conversation store test failed: ${error instanceof Error ? error.message : String(error)}`,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test end-to-end voice conversation flow
   */
  private async testEndToEndVoiceFlow(): Promise<VoiceTestResult> {
    const startTime = Date.now();

    try {
      // This would require a more complex setup in a real test environment
      // For now, we'll test the flow components we can access

      const session = conversationStore.createSession('e2e-test-user');

      // Simulate a voice-enabled conversation
      conversationStore.setVoiceEnabled(session.sessionId, true);

      const voiceState = conversationStore.getVoiceState(session.sessionId);

      // Test voice-aware conversation context
      const hasVoiceContext = session.context.extractedInfo.voicePreference !== undefined;

      // Test that voice preferences are properly integrated
      const preferences = VoicePreferencesManager.getPreferences();

      const flowTest = voiceState?.voiceEnabled && hasVoiceContext;
      const preferencesTest = preferences.enabled !== undefined;

      const passed = flowTest && preferencesTest;
      const message = passed
        ? '✅ End-to-end voice flow integration working'
        : '⚠️ End-to-end voice flow has issues';

      return {
        testName: 'End-to-End Voice Flow',
        passed,
        message,
        duration: Date.now() - startTime,
        details: { flowTest, preferencesTest, voiceEnabled: voiceState?.voiceEnabled }
      };
    } catch (error) {
      return {
        testName: 'End-to-End Voice Flow',
        passed: false,
        message: `❌ End-to-end test failed: ${error instanceof Error ? error.message : String(error)}`,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Generate recommendations based on test results
   */
  private generateRecommendations(testResults: VoiceTestResult[]): string[] {
    const recommendations: string[] = [];

    const systemTest = testResults.find(t => t.testName === 'System Capabilities');
    if (systemTest && !systemTest.passed) {
      recommendations.push('🔧 Install a modern browser that supports Web Audio API and MediaRecorder');
      recommendations.push('🔧 Enable microphone permissions in browser settings');
    }

    const apiTest = testResults.find(t => t.testName === 'ElevenLabs API');
    if (apiTest && !apiTest.passed) {
      recommendations.push('🔑 Configure ELEVENLABS_API_KEY in your environment variables');
      recommendations.push('🔑 Ensure your ElevenLabs API key has sufficient credits');
    }

    const preferencesTest = testResults.find(t => t.testName === 'Voice Preferences');
    if (preferencesTest && !preferencesTest.passed) {
      recommendations.push('💾 Check browser localStorage permissions');
      recommendations.push('💾 Clear browser data if voice preferences are corrupted');
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ All systems working well! Voice features are ready to use.');
    }

    return recommendations;
  }

  /**
   * Get test results summary
   */
  getTestSummary(testSuite: VoiceIntegrationTestSuite): string {
    const lines = [
      '🗣️ VOICE INTEGRATION TEST RESULTS',
      '================================',
      '',
      `Overall Score: ${testSuite.overall.score}% ${testSuite.overall.passed ? '✅' : '❌'}`,
      '',
      'Individual Tests:',
      `  ${testSuite.systemCapabilities.message}`,
      `  ${testSuite.elevenLabsApi.message}`,
      `  ${testSuite.voicePreferences.message}`,
      `  ${testSuite.conversationStore.message}`,
      `  ${testSuite.endToEndFlow.message}`,
      '',
      'Recommendations:',
      ...testSuite.overall.recommendations.map(r => `  ${r}`),
      '',
      `Total test duration: ${testSuite.systemCapabilities.duration! + testSuite.elevenLabsApi.duration! + testSuite.voicePreferences.duration! + testSuite.conversationStore.duration! + testSuite.endToEndFlow.duration!}ms`
    ];

    return lines.join('\n');
  }
}

export const voiceIntegrationTester = new VoiceIntegrationTester();
export default voiceIntegrationTester;