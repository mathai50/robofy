import React from 'react';
import { VoiceState } from '@/lib/conversation-store';

interface VoiceSettingsPanelProps {
  voiceState: VoiceState;
  onVoiceStateChange: (updates: Partial<VoiceState>) => void;
  onClose: () => void;
  className?: string;
}

export default function VoiceSettingsPanel({
  voiceState,
  onVoiceStateChange,
  onClose,
  className = ''
}: VoiceSettingsPanelProps) {
  const voiceOptions = [
    { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', description: 'Professional & clear' },
    { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi', description: 'Warm & engaging' },
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', description: 'Clear & articulate' },
  ];

  return (
    <div className={`border-t border-gray-200 p-4 bg-gray-50 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-800">Voice Settings</h4>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close voice settings"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {/* Voice Selection */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">Voice</label>
          <div className="space-y-2">
            {voiceOptions.map((voice) => (
              <label key={voice.id} className="flex items-center">
                <input
                  type="radio"
                  name="voice"
                  value={voice.id}
                  checked={voiceState.voiceSettings.voiceId === voice.id}
                  onChange={(e) => onVoiceStateChange({
                    voiceSettings: { ...voiceState.voiceSettings, voiceId: e.target.value }
                  })}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800">{voice.name}</div>
                  <div className="text-xs text-gray-500">{voice.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Playback Speed */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Playback Speed: {voiceState.voiceSettings.playbackSpeed}x
          </label>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={voiceState.voiceSettings.playbackSpeed}
            onChange={(e) => onVoiceStateChange({
              voiceSettings: { ...voiceState.voiceSettings, playbackSpeed: parseFloat(e.target.value) }
            })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.5x</span>
            <span>1.0x</span>
            <span>2.0x</span>
          </div>
        </div>

        {/* Volume */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Volume: {Math.round(voiceState.voiceSettings.volume * 100)}%
          </label>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.1"
            value={voiceState.voiceSettings.volume}
            onChange={(e) => onVoiceStateChange({
              voiceSettings: { ...voiceState.voiceSettings, volume: parseFloat(e.target.value) }
            })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>10%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Auto-play Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-800">Auto-play responses</div>
            <div className="text-xs text-gray-500">Automatically play voice responses</div>
          </div>
          <button
            onClick={() => onVoiceStateChange({
              voiceSettings: { ...voiceState.voiceSettings, autoPlay: !voiceState.voiceSettings.autoPlay }
            })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              voiceState.voiceSettings.autoPlay ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                voiceState.voiceSettings.autoPlay ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Voice Enable/Disable */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <div>
            <div className="text-sm font-medium text-gray-800">Voice Responses</div>
            <div className="text-xs text-gray-500">Enable text-to-speech for AI responses</div>
          </div>
          <button
            onClick={() => onVoiceStateChange({ voiceEnabled: !voiceState.voiceEnabled })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              voiceState.voiceEnabled ? 'bg-green-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                voiceState.voiceEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}