'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const providers = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'google', label: 'Google AI' },
  { value: 'deepseek', label: 'DeepSeek' },
  { value: 'huggingface', label: 'Hugging Face' }
];

// Validation patterns for different providers
const apiKeyPatterns: { [key: string]: RegExp } = {
  openai: /^sk-[a-zA-Z0-9]{48}$/,
  google: /^[a-zA-Z0-9-_]{40}$/,
  deepseek: /^[a-zA-Z0-9]{64}$/,
  huggingface: /^hf_[a-zA-Z0-9]{32}$/
};

// Validation error messages
const validationMessages: { [key: string]: string } = {
  openai: 'OpenAI API key should start with "sk-" and be 51 characters long',
  google: 'Google AI API key should be 40 characters long with alphanumeric and hyphen characters',
  deepseek: 'DeepSeek API key should be 64 characters long with alphanumeric characters',
  huggingface: 'Hugging Face API key should start with "hf_" and be 35 characters long'
};

interface APIKeyFormProps {
  onSuccess?: () => void;
}

export function APIKeyForm({ onSuccess }: APIKeyFormProps) {
  const [provider, setProvider] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Validate API key format when provider or API key changes
  useEffect(() => {
    if (provider && apiKey.trim().length > 0) {
      const pattern = apiKeyPatterns[provider];
      if (pattern && !pattern.test(apiKey)) {
        setValidationError(validationMessages[provider]);
      } else {
        setValidationError(null);
      }
    } else {
      setValidationError(null);
    }
  }, [provider, apiKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation before submission
    if (provider && apiKey.trim().length > 0) {
      const pattern = apiKeyPatterns[provider];
      if (pattern && !pattern.test(apiKey)) {
        setValidationError(validationMessages[provider]);
        return;
      }
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    setValidationError(null);
    
    try {
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ provider, api_key: apiKey })
      });
      
      if (response.ok) {
        setSuccess(true);
        setApiKey('');
        setProvider('');
        if (onSuccess) onSuccess();
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to save API key');
      }
    } catch (error) {
      console.error('Error saving API key:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProvider(e.target.value);
    setValidationError(null); // Clear validation error when provider changes
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const isFormValid = provider && apiKey.trim().length > 0 && !validationError;

  return (
    <Card className="bg-[#1a1c22] border-[#2e3039]">
      <CardHeader className="border-b border-[#2e3039]">
        <h3 className="text-lg font-semibold text-[#f0f0f0]">Add API Key</h3>
        <p className="text-sm text-gray-300">Configure your AI service API keys for personalized AI experiences</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-[#2e3039] border border-[#444658] text-[#f0f0f0] px-4 py-3 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-[#2e3039] border border-[#444658] text-[#f0f0f0] px-4 py-3 rounded-md">
            API key saved successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="provider" className="text-sm font-medium text-[#f0f0f0]">
              AI Provider
            </label>
            <select
              id="provider"
              value={provider}
              onChange={handleProviderChange}
              className="w-full bg-[#2e3039] border border-[#444658] text-[#f0f0f0] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f0f0f0] focus:border-[#f0f0f0]"
            >
              <option value="">Select AI Provider</option>
              {providers.map((provider) => (
                <option key={provider.value} value={provider.value}>
                  {provider.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium text-[#f0f0f0]">
              API Key
            </label>
            <Input
              type="password"
              placeholder="Enter your API key"
              value={apiKey}
              onChange={handleApiKeyChange}
              required
              error={validationError || undefined}
            />
            {!validationError && (
              <p className="text-xs text-gray-400">
                Your API key is encrypted and stored securely. It will only be used for your AI requests.
              </p>
            )}
          </div>
          
          <Button
            type="submit"
            disabled={isSubmitting || !isFormValid}
            className="w-full bg-[#444658] hover:bg-[#2e3039] text-[#f0f0f0] border border-[#444658]"
          >
            {isSubmitting ? 'Saving...' : 'Save API Key'}
          </Button>
        </form>

        <div className="text-xs text-gray-400 space-y-1">
          <p>🔒 All API keys are encrypted at rest</p>
          <p>👤 Keys are associated with your account only</p>
          <p>⚡ Keys are used for personalized AI experiences</p>
        </div>
      </CardContent>
    </Card>
  );
}