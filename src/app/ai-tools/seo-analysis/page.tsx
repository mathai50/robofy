'use client';

import { useState, useEffect } from 'react';
import { AuthService } from '@/lib/auth';
import SEODashboard from '@/components/seo/SEODashboard';

export default function SimpleSEOPage() {
  const [url, setUrl] = useState('');
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<string>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Extract domain from URL
      let domain = url;
      const urlMatch = url.match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
        try {
          const urlObj = new URL(urlMatch[0]);
          domain = urlObj.hostname;
        } catch {
          // If URL parsing fails, use input as is
        }
      }

      // Use the new comprehensive SEO analysis endpoint
      const response = await fetch('http://localhost:8000/api/seo/comprehensive-analysis', {
        method: 'POST',
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify({
          domain: domain
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = 'Failed to perform SEO analysis';
        
        // Handle different error response formats
        if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        } else if (errorData.detail && typeof errorData.detail === 'object') {
          // Try to extract message from structured error
          if (errorData.detail.message) {
            errorMessage = errorData.detail.message;
          } else if (errorData.detail.error && errorData.detail.error.message) {
            errorMessage = errorData.detail.error.message;
          } else {
            errorMessage = JSON.stringify(errorData.detail);
          }
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setAnalysisId('direct-analysis'); // Set a dummy ID since we're not using orchestration
      // Store the analysis data in session storage for the dashboard to access
      sessionStorage.setItem('seoAnalysisData', JSON.stringify(data));
    } catch (err) {
      console.error('Error starting analysis:', err);
      let errorMessage = 'Failed to start analysis';
      
      // Handle various error formats to prevent [object Object]
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null) {
        // Try to extract message from object with multiple common patterns
        if ('message' in err && typeof err.message === 'string') {
          errorMessage = err.message;
        } else if ('detail' in err && typeof err.detail === 'string') {
          errorMessage = err.detail;
        } else if ('error' in err && typeof err.error === 'string') {
          errorMessage = err.error;
        } else if ('error' in err && typeof err.error === 'object' && err.error !== null) {
          // Nested error object
          if ('message' in err.error && typeof err.error.message === 'string') {
            errorMessage = err.error.message;
          } else {
            errorMessage = JSON.stringify(err.error);
          }
        } else {
          // Fallback: stringify the entire object
          errorMessage = JSON.stringify(err);
        }
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // For direct analysis, immediately set status to completed
    if (analysisId === 'direct-analysis') {
      setAnalysisStatus('completed');
    }
  }, [analysisId]);

  if (analysisId && analysisStatus === 'completed') {
    return (
      <div className="min-h-screen bg-gray-900 p-4">
        <div className="max-w-6xl mx-auto">
          <SEODashboard analysisId={analysisId} useDirectData={true} />
        </div>
      </div>
    );
  }

  if (analysisId && (analysisStatus === 'processing' || analysisStatus === 'queued')) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Analysis in Progress</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">
            Your SEO analysis is being processed. This may take a few minutes...
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Status: {analysisStatus}
          </p>
        </div>
      </div>
    );
  }

  if (analysisId && analysisStatus === 'failed') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-white mb-4">Analysis Failed</h1>
          <div className="p-3 bg-red-500/10 border border-red-500 rounded-md">
            <p className="text-red-300">{error}</p>
          </div>
          <button
            onClick={() => {
              setAnalysisId(null);
              setAnalysisStatus('idle');
              setError(null);
            }}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-4">SEO Analysis</h1>
        <p className="text-gray-300 mb-6">
          Enter a website URL to perform comprehensive SEO analysis. The analysis will include competitor benchmarking, keyword research, and technical SEO audit.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
              Website URL
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500 rounded-md">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-md transition-colors"
          >
            {isLoading ? 'Starting Analysis...' : 'Start SEO Analysis'}
          </button>
        </form>
        
        <div className="mt-6 p-4 bg-gray-700 rounded-md">
          <h2 className="text-lg font-medium text-white mb-2">How it works:</h2>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Enter any website URL (include http:// or https://)</li>
            <li>• Our system will perform comprehensive SEO analysis</li>
            <li>• Results will be displayed in an interactive dashboard</li>
            <li>• Analysis includes competitors, keywords, and technical SEO</li>
          </ul>
        </div>
      </div>
    </div>
  );
}