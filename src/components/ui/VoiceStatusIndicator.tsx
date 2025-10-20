import React from 'react';
import AudioWaveform from './AudioWaveform';
import { VoiceState } from '@/lib/conversation-store';

interface VoiceStatusIndicatorProps {
  voiceState: VoiceState | null;
  isRecording: boolean;
  isPlaying: boolean;
  audioLevel?: number;
  className?: string;
}

export default function VoiceStatusIndicator({
  voiceState,
  isRecording,
  isPlaying,
  audioLevel = 0,
  className = ''
}: VoiceStatusIndicatorProps) {
  if (!voiceState?.voiceEnabled) {
    return (
      <div className={`flex items-center text-sm text-gray-500 ${className}`}>
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
        Voice disabled
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Status Indicator */}
      <div className="flex items-center">
        {isRecording ? (
          <div className="flex items-center text-red-600">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm font-medium">Recording</span>
          </div>
        ) : isPlaying ? (
          <div className="flex items-center text-blue-600">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium">Playing</span>
          </div>
        ) : (
          <div className="flex items-center text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium">Ready</span>
          </div>
        )}
      </div>

      {/* Waveform Visualization */}
      <AudioWaveform
        isRecording={isRecording}
        isPlaying={isPlaying}
        audioLevel={audioLevel}
        className="flex-1"
      />

      {/* Voice Info */}
      <div className="text-xs text-gray-500">
        <div>Speed: {voiceState.voiceSettings.playbackSpeed}x</div>
        <div>Vol: {Math.round(voiceState.voiceSettings.volume * 100)}%</div>
      </div>
    </div>
  );
}