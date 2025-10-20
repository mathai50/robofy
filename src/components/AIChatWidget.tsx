'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ConversationContext, aiService, VoiceMessageData } from '@/services/aiService';
import conversationStore, { VoiceState } from '@/lib/conversation-store';
import { createLead } from '@/lib/api';
import elevenLabsService from '@/services/elevenLabsService';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
}

interface AIChatWidgetProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function AIChatWidget({ isOpen = false, onToggle }: AIChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadInfo, setLeadInfo] = useState({
    name: '',
    email: '',
    company: '',
    phone: ''
  });

  // Voice-related state
  const [voiceState, setVoiceState] = useState<VoiceState | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioQueue, setAudioQueue] = useState<string[]>([]);
  const [currentPlayingMessageId, setCurrentPlayingMessageId] = useState<string>('');
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Initialize chat session
  useEffect(() => {
    if (isOpen && !sessionId) {
      const session = conversationStore.createSession();
      setSessionId(session.sessionId);

      // Add welcome message
      const welcomeMessage: Message = {
        id: 'welcome',
        content: "Hi there! I'm Thommo, your AI assistant from Robofy. I'm excited to help transform your small or medium business with AI-powered solutions! To get started and provide you with personalized recommendations, could you please share your name and email address? Once I have that, I'd love to learn about your business sector, your most pressing challenges, what services you're interested in, your timeline, and budget range.",
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, sessionId]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize voice state
  useEffect(() => {
    if (isOpen && sessionId) {
      const session = conversationStore.getSession(sessionId);
      if (session?.voiceState) {
        setVoiceState(session.voiceState);
        setAudioQueue(session.voiceState.audioQueue);
        setCurrentPlayingMessageId(session.voiceState.currentPlayingMessageId || '');
      } else {
        // Initialize default voice state
        const defaultVoiceState: VoiceState = {
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
        setVoiceState(defaultVoiceState);
        conversationStore.updateVoiceState(sessionId, defaultVoiceState);
      }
    }
  }, [isOpen, sessionId]);

  // Handle audio playback queue
  useEffect(() => {
    if (audioQueue.length > 0 && voiceState?.voiceEnabled && voiceState?.voiceSettings.autoPlay) {
      playNextAudio();
    }
  }, [audioQueue, voiceState]);

  // Voice control functions
  const playNextAudio = async () => {
    if (audioQueue.length === 0 || !voiceState?.voiceEnabled) return;

    const audioUrl = audioQueue[0];
    if (!audioUrl) return;

    try {
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.volume = voiceState.voiceSettings.volume;
        audioRef.current.playbackRate = voiceState.voiceSettings.playbackSpeed;
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    if (audioQueue.length > 0) {
      setAudioQueue(prev => prev.slice(1));
      conversationStore.dequeueAudio(sessionId);
    }
  };

  // Voice recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks(prev => [...prev, event.data]);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        await processVoiceInput(audioBlob);
        setAudioChunks([]);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      setIsRecording(true);
      recorder.start();

      // Update voice state
      conversationStore.updateVoiceState(sessionId, { isRecording: true });
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Microphone access is required for voice input.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
      conversationStore.updateVoiceState(sessionId, { isRecording: false });
    }
  };

  const processVoiceInput = async (audioBlob: Blob) => {
    try {
      // Convert speech to text
      const speechResult = await elevenLabsService.speechToText(audioBlob);

      if (speechResult.text) {
        // Process the transcribed text as a regular message
        const voiceMessage: Message = {
          id: Date.now().toString(),
          content: speechResult.text,
          sender: 'user',
          timestamp: new Date(),
          isTyping: false
        };

        setMessages(prev => [...prev, voiceMessage]);

        // Process with AI service
        await processMessageWithVoice(speechResult.text, {
          audioUrl: URL.createObjectURL(audioBlob),
          transcript: speechResult.text,
          isVoiceMessage: true,
          confidence: speechResult.confidence
        });
      }
    } catch (error) {
      console.error('Error processing voice input:', error);
    }
  };

  const processMessageWithVoice = async (message: string, voiceData?: VoiceMessageData) => {
    if (!sessionId) return;

    const session = conversationStore.getSession(sessionId);
    if (!session) return;

    setIsLoading(true);

    try {
      // Generate AI response with voice awareness
      const aiResponse = await aiService.generateResponse(message, session.context, voiceData);

      // Update session
      conversationStore.updateSession(sessionId, aiResponse);

      // Generate audio for the response if voice is enabled
      if (voiceState?.voiceEnabled) {
        try {
          const audioData = await elevenLabsService.textToSpeech(
            aiResponse.message,
            {
              voiceId: voiceState.voiceSettings.voiceId,
              model: 'eleven_multilingual_v1',
              voiceSettings: {
                stability: 0.5,
                similarity_boost: 0.8,
                style: 0.5,
                use_speaker_boost: true,
              }
            }
          );

          // Add to audio queue
          setAudioQueue(prev => [...prev, audioData.audioUrl]);
          conversationStore.queueAudio(sessionId, audioData.audioUrl, (Date.now() + 1).toString());
        } catch (audioError) {
          console.error('Error generating audio:', audioError);
          // Continue without audio
        }
      }

      // Add response message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.message,
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Check for lead capture
      if (aiResponse.shouldAskForLeadInfo) {
        setTimeout(() => setShowLeadCapture(true), 1000);
      }

    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble responding right now. Please try again.",
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoice = () => {
    if (!voiceState) return;

    const newVoiceEnabled = !voiceState.voiceEnabled;
    setVoiceState(prev => prev ? { ...prev, voiceEnabled: newVoiceEnabled } : null);
    conversationStore.setVoiceEnabled(sessionId, newVoiceEnabled);
  };

  const handleVoiceSettings = () => {
    setShowVoiceSettings(!showVoiceSettings);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Get current session
      const session = conversationStore.getSession(sessionId);
      if (!session) {
        throw new Error('Session not found');
      }

      // Generate AI response
      const aiResponse = await aiService.generateResponse(inputMessage, session.context);

      // Update session with new context
      conversationStore.updateSession(sessionId, aiResponse);

      // Add AI response to messages
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.message,
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Check if we should ask for lead information
      if (aiResponse.shouldAskForLeadInfo) {
        setTimeout(() => {
          setShowLeadCapture(true);
        }, 1000);
      }

      // Check if we should automatically create a lead
      if (aiResponse.leadScore >= 75) {
        const qualification = await aiService.qualifyLead(aiResponse.conversationContext);
        if (qualification.shouldCreateLead && qualification.leadData) {
          try {
            const leadResponse = await createLead(qualification.leadData);
            if (leadResponse.success) {
              conversationStore.markLeadCreated(sessionId, leadResponse.data?.leadId || '');

              const leadCreatedMessage: Message = {
                id: (Date.now() + 2).toString(),
                content: "Perfect! I've captured your information and created a lead for you. Our team will be in touch within 24 hours with personalized recommendations for your business needs.",
                sender: 'assistant',
                timestamp: new Date()
              };
              setMessages(prev => [...prev, leadCreatedMessage]);
            }
          } catch (error) {
            console.error('Failed to create lead:', error);
          }
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeadCaptureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!leadInfo.email) {
      alert('Please provide at least your email address.');
      return;
    }

    try {
      const session = conversationStore.getSession(sessionId);
      if (session) {
        // Update session context with lead information
        session.context.extractedInfo = {
          ...session.context.extractedInfo,
          ...leadInfo
        };

        // Create lead data
        const leadData = {
          name: leadInfo.name || 'Website Visitor',
          email: leadInfo.email,
          company: leadInfo.company,
          phone: leadInfo.phone,
          industry: session.context.industry,
          message: `AI Chat Lead - Score: ${session.context.leadScore}. Captured via chat widget. Goals: ${session.context.extractedInfo.goals?.join(', ') || 'Not specified'}`,
          leadSource: 'ai_chat_widget',
          leadScore: session.context.leadScore
        };

        const leadResponse = await createLead(leadData);
        if (leadResponse.success) {
          conversationStore.markLeadCreated(sessionId, leadResponse.data?.leadId || '');

          const successMessage: Message = {
            id: Date.now().toString(),
            content: "Thank you for sharing your information! Our team will be in touch within 24 hours with personalized recommendations for your business.",
            sender: 'assistant',
            timestamp: new Date()
          };

          setMessages(prev => [...prev, successMessage]);
          setShowLeadCapture(false);

          // Reset lead info form
          setLeadInfo({
            name: '',
            email: '',
            company: '',
            phone: ''
          });
        } else {
          throw new Error(leadResponse.error || 'Failed to create lead');
        }
      }
    } catch (error) {
      console.error('Error creating lead:', error);
      alert('Failed to submit your information. Please try again.');
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={onToggle}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-colors duration-200"
          aria-label="Open AI Chat"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col border border-gray-200">
        {/* Header */}
        <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${isRecording ? 'bg-red-400' : isPlaying ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
            <span className="font-medium">Robofy AI Assistant</span>
          </div>
          <div className="flex items-center space-x-2">
            {/* Voice Controls */}
            <button
              onClick={toggleVoice}
              className={`p-1.5 rounded transition-colors ${voiceState?.voiceEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-600 hover:bg-gray-700'}`}
              aria-label={voiceState?.voiceEnabled ? "Disable voice" : "Enable voice"}
              title={voiceState?.voiceEnabled ? "Voice enabled" : "Voice disabled"}
            >
              {voiceState?.voiceEnabled ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" />
                </svg>
              )}
            </button>

            <button
              onClick={handleVoiceSettings}
              className="p-1.5 rounded hover:bg-blue-700 transition-colors"
              aria-label="Voice settings"
              title="Voice settings"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            <button
              onClick={onToggle}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 px-3 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Voice Settings Panel */}
        {showVoiceSettings && voiceState && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-800 mb-3">Voice Settings</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Voice</label>
                <select
                  value={voiceState.voiceSettings.voiceId}
                  onChange={(e) => {
                    const newSettings = { ...voiceState.voiceSettings, voiceId: e.target.value };
                    setVoiceState(prev => prev ? { ...prev, voiceSettings: newSettings } : null);
                    conversationStore.updateVoiceSettings(sessionId, { voiceId: e.target.value });
                  }}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="21m00Tcm4TlvDq8ikWAM">Rachel (Professional)</option>
                  <option value="AZnzlk1XvdvUeBnXmlld">Domi (Warm)</option>
                  <option value="EXAVITQu4vr4xnSDxMaL">Bella (Clear)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Playback Speed: {voiceState.voiceSettings.playbackSpeed}x</label>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={voiceState.voiceSettings.playbackSpeed}
                  onChange={(e) => {
                    const newSettings = { ...voiceState.voiceSettings, playbackSpeed: parseFloat(e.target.value) };
                    setVoiceState(prev => prev ? { ...prev, voiceSettings: newSettings } : null);
                    conversationStore.updateVoiceSettings(sessionId, { playbackSpeed: parseFloat(e.target.value) });
                  }}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Volume: {Math.round(voiceState.voiceSettings.volume * 100)}%</label>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={voiceState.voiceSettings.volume}
                  onChange={(e) => {
                    const newSettings = { ...voiceState.voiceSettings, volume: parseFloat(e.target.value) };
                    setVoiceState(prev => prev ? { ...prev, voiceSettings: newSettings } : null);
                    conversationStore.updateVoiceSettings(sessionId, { volume: parseFloat(e.target.value) });
                  }}
                  className="w-full"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoPlay"
                  checked={voiceState.voiceSettings.autoPlay}
                  onChange={(e) => {
                    const newSettings = { ...voiceState.voiceSettings, autoPlay: e.target.checked };
                    setVoiceState(prev => prev ? { ...prev, voiceSettings: newSettings } : null);
                    conversationStore.updateVoiceSettings(sessionId, { autoPlay: e.target.checked });
                  }}
                  className="mr-2"
                />
                <label htmlFor="autoPlay" className="text-xs text-gray-600">Auto-play responses</label>
              </div>

              <button
                onClick={() => setShowVoiceSettings(false)}
                className="w-full bg-gray-300 text-gray-700 py-1 px-2 rounded text-xs hover:bg-gray-400 transition-colors"
              >
                Close Settings
              </button>
            </div>
          </div>
        )}

        {/* Lead Capture Form */}
        {showLeadCapture && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-800 mb-2">Let's get you the right solution!</h4>
            <form onSubmit={handleLeadCaptureSubmit} className="space-y-2">
              <input
                type="text"
                placeholder="Your name"
                value={leadInfo.name}
                onChange={(e) => setLeadInfo(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Your email *"
                value={leadInfo.email}
                onChange={(e) => setLeadInfo(prev => ({ ...prev, email: e.target.value }))}
                required
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Company name"
                value={leadInfo.company}
                onChange={(e) => setLeadInfo(prev => ({ ...prev, company: e.target.value }))}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-1 px-2 rounded text-xs hover:bg-blue-700 transition-colors"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowLeadCapture(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-1 px-2 rounded text-xs hover:bg-gray-400 transition-colors"
                >
                  Skip
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Message Input */}
        {!showLeadCapture && (
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              {/* Microphone Button */}
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isLoading}
                className={`p-2 rounded-full transition-colors ${
                  isRecording
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
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
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Hidden audio element for playback */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnd}
        onError={(e) => {
          console.error('Audio playback error:', e);
          handleAudioEnd();
        }}
        style={{ display: 'none' }}
      />
    </div>
  );
}