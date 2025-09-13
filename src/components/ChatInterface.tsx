'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, MessageSquare } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  toolName: string;
  toolDescription: string;
  apiEndpoint: string;
  quickActions?: Array<{
    id: string;
    label: string;
    description: string;
    icon: React.ReactNode;
    prompt: string;
  }>;
  placeholder?: string;
  welcomeMessage?: string;
}

export default function ChatInterface({
  toolName,
  toolDescription,
  apiEndpoint,
  quickActions = [],
  placeholder = "Type your message...",
  welcomeMessage = `Hello! How can I help you with ${toolName.toLowerCase()}?`
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuickAction = async (prompt: string) => {
    setInput(prompt);
    await handleSubmit(prompt);
  };

  const handleSubmit = async (customPrompt?: string) => {
    const messageToSend = customPrompt || input;
    if (!messageToSend.trim()) return;

    setIsLoading(true);
    setError(null);

    // Add user message to the chat
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageToSend,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
    if (!customPrompt) {
      setInput('');
    }

    try {
      // Send message to backend API - using the exact same structure as the working AI tools page
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          tool: toolName.toLowerCase() // Include tool context for better responses
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      
      // Add assistant message to the chat
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit();
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
                  <p className="text-gray-400">Choose an option below or type your message</p>
                </div>
                
                {/* Quick Actions Grid */}
                {quickActions.length > 0 && (
                  <div className="flex flex-wrap gap-3 justify-center">
                    {quickActions.map((action) => (
                      <button
                        key={action.id}
                        onClick={() => handleQuickAction(action.prompt)}
                        className="px-4 py-2 border border-[#444658] text-[#f0f0f0] rounded-full hover:bg-[#2e3039] transition-all duration-200 text-sm font-medium"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
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
                    <div className="bg-[#444658] text-white px-4 py-2 rounded-lg border border-[#2e3039]">
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={onSubmit} className="p-6 border-t border-[#2e3039]">
            <div className="flex space-x-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
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