'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { Send, Loader2, MessageSquare } from 'lucide-react';
import { AuthService } from '@/lib/auth';

interface AIChatProps {
  toolName: string;
  toolDescription: string;
  apiEndpoint: string;
  placeholder?: string;
  welcomeMessage?: string;
}

export default function AIChat({
  toolName,
  toolDescription,
  apiEndpoint,
  placeholder = "Type your message...",
  welcomeMessage = `Hello! How can I help you with ${toolName.toLowerCase()}?`
}: AIChatProps) {
  const [error, setError] = useState<string | null>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChat({
    api: apiEndpoint,
    headers: {
      'Authorization': `Bearer ${AuthService.getToken()}`,
      'Content-Type': 'application/json',
    },
    onError: (error) => {
      console.error('Chat error:', error);
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        setError('Authentication failed. Please log in again.');
      } else {
        setError(error.message);
      }
    },
    onResponse: (response) => {
      if (!response.ok) {
        if (response.status === 401) {
          setError('Authentication failed. Please log in again.');
        } else {
          setError(`Server error: ${response.status}`);
        }
      } else {
        setError(null);
      }
    }
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            {toolName}
          </h1>
          <p className="text-lg text-gray-300">
            {toolDescription}
          </p>
        </div>

        {/* Chat Container */}
        <div className="bg-[#1a1c22] rounded-lg border border-[#2e3039]">
          {/* Chat Header */}
          <div className="bg-[#2e3039] text-white p-6 rounded-t-lg">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-8 h-8 text-[#f0f0f0]" />
              <div>
                <h2 className="text-2xl font-semibold text-[#f0f0f0]">AI Assistant</h2>
                <p className="text-gray-300">Specialized in {toolName.toLowerCase()}</p>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="p-6 overflow-y-auto max-h-96">
            {messages.length === 0 ? (
              <div className="space-y-6">
                <div className="text-center text-gray-300 py-8">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50 text-[#f0f0f0]" />
                  <p className="text-xl font-semibold text-[#f0f0f0] mb-2">{welcomeMessage}</p>
                  <p className="text-gray-400">Type your message below to get started</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`px-4 py-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-[#2e3039] text-[#f0f0f0] max-w-xs'
                          : 'bg-[#444658] text-white shadow-sm w-full max-w-none'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#444658] text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-150"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-300"></div>
                      </div>
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                )}
                {error && (
                  <div className="flex justify-start">
                    <div className="bg-red-500 text-white px-4 py-2 rounded-lg border border-red-600">
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div />
          </div>

          {/* Input Form */}
          <form onSubmit={onSubmit} className="p-6 border-t border-[#2e3039]">
            <div className="flex space-x-3">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="flex-1 px-4 py-3 border border-[#444658] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f0f0f0] bg-[#2e3039] text-[#f0f0f0] placeholder-gray-400"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-[#444658] hover:bg-[#2e3039] disabled:bg-[#1a1c22] text-[#f0f0f0] p-3 rounded-lg transition-colors border border-[#444658]"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Send className="w-6 h-6" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}