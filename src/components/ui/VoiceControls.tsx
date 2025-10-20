import React from 'react';

interface VoiceControlsProps {
  isRecording: boolean;
  isPlaying: boolean;
  isVoiceEnabled: boolean;
  onToggleRecording: () => void;
  onToggleVoice: () => void;
  onVoiceSettings: () => void;
  disabled?: boolean;
}

export default function VoiceControls({
  isRecording,
  isPlaying,
  isVoiceEnabled,
  onToggleRecording,
  onToggleVoice,
  onVoiceSettings,
  disabled = false
}: VoiceControlsProps) {
  return (
    <div className="flex items-center space-x-2">
      {/* Voice Enable/Disable Button */}
      <button
        onClick={onToggleVoice}
        disabled={disabled}
        className={`p-1.5 rounded transition-colors ${
          isVoiceEnabled
            ? 'bg-green-500 hover:bg-green-600 text-white'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label={isVoiceEnabled ? "Disable voice" : "Enable voice"}
        title={isVoiceEnabled ? "Voice enabled" : "Voice disabled"}
      >
        {isVoiceEnabled ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Voice Settings Button */}
      <button
        onClick={onVoiceSettings}
        disabled={disabled}
        className="p-1.5 rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Voice settings"
        title="Voice settings"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Recording Button */}
      <button
        onClick={onToggleRecording}
        disabled={disabled || !isVoiceEnabled}
        className={`p-2 rounded-full transition-colors ${
          isRecording
            ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label={isRecording ? "Stop recording" : "Start voice recording"}
        title={isRecording ? "Click to stop recording" : "Click to start voice recording"}
      >
        {isRecording ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10l6 4m0-4l-6 4" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </button>

      {/* Playback Indicator */}
      {isPlaying && (
        <div className="flex items-center">
          <div className="flex space-x-1">
            <div className="w-1 h-3 bg-blue-500 rounded animate-pulse"></div>
            <div className="w-1 h-3 bg-blue-500 rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1 h-3 bg-blue-500 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="ml-1 text-xs text-gray-600">Playing</span>
        </div>
      )}
    </div>
  );
}