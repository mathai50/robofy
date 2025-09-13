'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

export interface WalkthroughStep {
  id: string;
  title: string;
  content: {
    type: 'text' | 'image' | 'video' | 'chatbot';
    data: string | { src: string; alt?: string } | ChatbotInteraction[];
    description?: string;
  };
  interactive?: boolean;
  highlightElement?: string;
  delay?: number;
}

export interface ChatbotInteraction {
  type: 'user' | 'bot';
  content: string;
  delay?: number;
  options?: string[];
}

interface ModalWalkthroughProps {
  isOpen: boolean;
  onClose: () => void;
  steps: WalkthroughStep[];
  onStepChange?: (currentStep: number) => void;
  onComplete?: () => void;
  skipButtonText?: string;
  closeButtonText?: string;
  className?: string;
}

const ModalWalkthrough: React.FC<ModalWalkthroughProps> = ({
  isOpen,
  onClose,
  steps,
  onStepChange,
  onComplete,
  skipButtonText = 'Skip Walkthrough',
  closeButtonText = 'Close',
  className = '',
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [chatbotMessages, setChatbotMessages] = useState<ChatbotInteraction[]>([]);
  const [userInput, setUserInput] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  // Handle step changes
  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentStep);
    }

    // Reset chatbot state when step changes
    if (currentStepData.content.type === 'chatbot') {
      setChatbotMessages([]);
      setIsTyping(true);
      
      const chatbotData = currentStepData.content.data as ChatbotInteraction[];
      const simulateTyping = async () => {
        for (const message of chatbotData) {
          if (message.type === 'bot') {
            setIsTyping(true);
            await new Promise(resolve => setTimeout(resolve, message.delay || 1000));
            setIsTyping(false);
            setChatbotMessages(prev => [...prev, message]);
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
      };
      
      simulateTyping();
    }
  }, [currentStep, currentStepData, onStepChange]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && !isLastStep) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && !isFirstStep) {
        handlePrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFirstStep, isLastStep, onClose]);

  // Focus trap for accessibility
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }, [isOpen, currentStep]);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentStep, steps.length, onComplete]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleSkip = useCallback(() => {
    if (onComplete) {
      onComplete();
    }
    onClose();
  }, [onComplete, onClose]);

  const handleUserInput = (input: string) => {
    if (currentStepData.content.type === 'chatbot') {
      const userMessage: ChatbotInteraction = {
        type: 'user',
        content: input,
      };
      setChatbotMessages(prev => [...prev, userMessage]);
      setUserInput('');

      // Simulate bot response
      const chatbotData = currentStepData.content.data as ChatbotInteraction[];
      const botResponse = chatbotData.find(msg => msg.type === 'bot' && !chatbotMessages.some(m => m.content === msg.content));
      
      if (botResponse) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setChatbotMessages(prev => [...prev, botResponse]);
        }, botResponse.delay || 1000);
      }
    }
  };

  const renderContent = () => {
    const { type, data, description } = currentStepData.content;

    switch (type) {
      case 'text':
        return (
          <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed">{data as string}</p>
            {description && (
              <p className="text-sm text-gray-400 italic">{description}</p>
            )}
          </div>
        );

      case 'image':
        const imageData = data as { src: string; alt?: string };
        return (
          <div className="space-y-4">
            <img
              src={imageData.src}
              alt={imageData.alt || 'Step illustration'}
              className="w-full h-48 object-contain rounded-lg border border-gray-700"
            />
            {description && (
              <p className="text-sm text-gray-400 italic text-center">{description}</p>
            )}
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <video
              src={data as string}
              controls
              className="w-full h-48 object-contain rounded-lg border border-gray-700"
            />
            {description && (
              <p className="text-sm text-gray-400 italic text-center">{description}</p>
            )}
          </div>
        );

      case 'chatbot':
        return (
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-lg p-4 max-h-64 overflow-y-auto">
              <div className="space-y-3">
                {chatbotMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-white text-black'
                          : 'bg-gray-800 border border-gray-700 text-gray-300'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {currentStepData.interactive && (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-gray-900 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleUserInput(userInput)}
                />
                <button
                  onClick={() => handleUserInput(userInput)}
                  className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className={`bg-black rounded-xl shadow-2xl w-full max-w-2xl mx-auto transform transition-all duration-300 border border-gray-800 ${className}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 id="modal-title" className="text-xl font-semibold text-white">
            {currentStepData.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Area */}
        <div ref={contentRef} className="p-6" aria-live="polite">
          {renderContent()}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between p-6 border-t border-gray-800 bg-gray-900 rounded-b-xl">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <div className="flex space-x-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep ? 'bg-white' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              {skipButtonText}
            </button>

            {!isFirstStep && (
              <button
                onClick={handlePrevious}
                className="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Previous
              </button>
            )}

            <button
              onClick={isLastStep ? onClose : handleNext}
              className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isLastStep ? closeButtonText : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalWalkthrough;