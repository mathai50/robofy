'use client';

import { useChat } from 'ai/react';
import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, MessageSquare, X, Sparkles, Search, HelpCircle, Calendar, TrendingUp, Users } from 'lucide-react';

interface ChatInterfaceProps {
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export default function ChatInterface({ isOpen = false, onOpen, onClose }: ChatInterfaceProps) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    append,
  } = useChat({
    api: '/api/chat/messages',
    onError: (error) => {
      console.error('Chat error:', error);
    },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showQuickActions, setShowQuickActions] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const quickActions = [
    {
      id: 'seo',
      label: 'SEO Analysis',
      description: 'Get SEO recommendations and analysis',
      icon: <Search className="w-5 h-5" />,
      prompt: 'Can you analyze my website SEO and provide recommendations?'
    },
    {
      id: 'support',
      label: 'Customer Support',
      description: 'Get help with technical issues',
      icon: <HelpCircle className="w-5 h-5" />,
      prompt: 'I need help with a technical issue on the platform.'
    },
    {
      id: 'appointment',
      label: 'Book Appointment',
      description: 'Schedule a consultation call',
      icon: <Calendar className="w-5 h-5" />,
      prompt: 'I would like to schedule a consultation appointment.'
    },
    {
      id: 'competitor',
      label: 'Competitor Analysis',
      description: 'Analyze competitor strategies',
      icon: <TrendingUp className="w-5 h-5" />,
      prompt: 'Can you help me analyze my competitors?'
    },
    {
      id: 'social',
      label: 'Social Media',
      description: 'Create social media content',
      icon: <Users className="w-5 h-5" />,
      prompt: 'Help me create social media content for my business.'
    },
    {
      id: 'content',
      label: 'Content Creation',
      description: 'Generate marketing content',
      icon: <Sparkles className="w-5 h-5" />,
      prompt: 'I need help creating marketing content for my business.'
    }
  ];

  const handleQuickAction = async (prompt: string) => {
    setShowQuickActions(false);
    await append({ role: 'user', content: prompt });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => onOpen?.()}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 group"
        aria-label="Open chat"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          AI
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
      {/* Chat Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5" />
          <h3 className="font-semibold">Robofy AI Assistant</h3>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
          aria-label="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto max-h-96">
        {messages.length === 0 && showQuickActions ? (
          <div className="space-y-4">
            <div className="text-center text-gray-500 py-4">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-lg font-semibold mb-4">Hello! How can I help you today?</p>
              <p className="text-sm text-gray-400 mb-6">Choose an option below or type your message</p>
            </div>
            
            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action.prompt)}
                  className="flex flex-col items-center p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all duration-200 group"
                >
                  <div className="text-blue-600 mb-2 group-hover:text-blue-800">
                    {action.icon}
                  </div>
                  <span className="text-sm font-medium text-blue-800 group-hover:text-blue-900">
                    {action.label}
                  </span>
                  <span className="text-xs text-blue-600 mt-1 group-hover:text-blue-700">
                    {action.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Hello! I'm here to help with digital marketing automation. How can I assist you today?</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                  <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            )}
            {error && (
              <div className="flex justify-start">
                <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg">
                  <p className="text-sm">Sorry, there was an error. Please try again.</p>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={onSubmit} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}