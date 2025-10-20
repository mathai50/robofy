'use client';

import React, { useState } from 'react';
import Header from '../../components/seo-analyzer/Header';
import UrlInputForm from '../../components/seo-analyzer/UrlInputForm';
import Dashboard from '../../components/seo-analyzer/Dashboard';
// TODO: Restore these services if SEO analysis feature should be kept
// import { generateComprehensiveAnalysis } from '../../../services/geminiService';
// import { fetchPageSpeedData } from '../../../services/pagespeedApiService';
// import { fetchSerpData } from '../../../services/serpApiService';
import type { ComprehensiveAnalysis } from '../../types';

const SeoAnalysisPage: React.FC = () => {
  const [analysis, setAnalysis] = useState<ComprehensiveAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');

  const handleAnalyze = async (url: string, query: string, location: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    setCurrentQuery(query);
    setCurrentLocation(location);

    try {
      // TODO: Restore these services if SEO analysis feature should be kept
      // setLoadingStep('Running Lighthouse speed checks...');
      // const pageSpeedData = await fetchPageSpeedData(url);

      // setLoadingStep('Analyzing search results for competitors...');
      // const strategicQuery = `top ${query} companies in ${location}`;
      // const serpData = await fetchSerpData(strategicQuery, location);

      // setLoadingStep('Gemini agents are performing the final analysis...');
      // const geminiAnalysis = await generateComprehensiveAnalysis(url, query, location, pageSpeedData, serpData);

      // Temporary mock response until services are restored
      setError('SEO analysis feature is temporarily disabled. AI chat system has been removed.');
      return; // Exit early since services are not available

      // setAnalysis(geminiAnalysis);

    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(`An error occurred during analysis: ${err.message}`);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 font-sans">
      <main className="container mx-auto px-4 py-8">
        <Header />
        <UrlInputForm onAnalyze={handleAnalyze} isLoading={isLoading} />

        {isLoading && (
          <div className="mt-12 flex flex-col items-center justify-center text-center">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-slate-700 h-12 w-12 mb-4 animate-spin" style={{borderTopColor: '#38bdf8'}}></div>
            <h2 className="text-2xl font-semibold text-sky-400">Performing Analysis...</h2>
            <p className="text-slate-400 mt-2 max-w-md">{loadingStep || 'Initializing...'}</p>
          </div>
        )}

        {error && (
          <div className="mt-12 text-center bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg max-w-2xl mx-auto">
            <h3 className="font-bold">Analysis Failed</h3>
            <p>{error}</p>
          </div>
        )}

        {analysis && !isLoading && (
          <div className="mt-12 animate-fade-in">
            <Dashboard analysis={analysis} query={currentQuery} location={currentLocation} />
          </div>
        )}
      </main>
      <footer className="text-center py-4 text-xs text-slate-500">
        <p>SEO Analyzer powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default SeoAnalysisPage;