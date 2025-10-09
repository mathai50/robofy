'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronRight, Check, AlertCircle, Bot, Database, BarChart3, Users, Sparkles } from 'lucide-react';

interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'processing' | 'completed' | 'error';
  duration: number;
}

const InteractiveDemoWidget: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showFallback, setShowFallback] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  const workflowSteps: WorkflowStep[] = [
    {
      id: 1,
      title: 'Data Collection',
      description: 'Gathering customer data from multiple sources',
      icon: <Database className="w-6 h-6" />,
      status: 'pending',
      duration: 2000
    },
    {
      id: 2,
      title: 'AI Analysis',
      description: 'Processing data with machine learning algorithms',
      icon: <Bot className="w-6 h-6" />,
      status: 'pending',
      duration: 3000
    },
    {
      id: 3,
      title: 'Insight Generation',
      description: 'Creating actionable business insights',
      icon: <BarChart3 className="w-6 h-6" />,
      status: 'pending',
      duration: 2500
    },
    {
      id: 4,
      title: 'Personalization',
      description: 'Tailoring experiences for individual customers',
      icon: <Users className="w-6 h-6" />,
      status: 'pending',
      duration: 2000
    },
    {
      id: 5,
      title: 'Automation Execution',
      description: 'Deploying automated workflows across channels',
      icon: <Sparkles className="w-6 h-6" />,
      status: 'pending',
      duration: 3500
    }
  ];

  useEffect(() => {
    // Lazy loading simulation - show fallback if component doesn't load within 3 seconds
    const timer = setTimeout(() => {
      if (!widgetRef.current) {
        setShowFallback(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const startWorkflow = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setCurrentStep(0);
    setProgress(0);

    for (let i = 0; i < workflowSteps.length; i++) {
      setCurrentStep(i);
      setProgress(((i + 1) / workflowSteps.length) * 100);

      // Simulate processing time for this step
      await new Promise(resolve => setTimeout(resolve, workflowSteps[i].duration));

      if (i === workflowSteps.length - 1) {
        // Reset after completion
        setTimeout(() => {
          setIsRunning(false);
          setCurrentStep(0);
          setProgress(0);
        }, 2000);
      }
    }
  };

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'processing';
    return 'pending';
  };

  const getStatusIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4 text-green-400" />;
      case 'processing':
        return <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <div className="w-4 h-4 border-2 border-gray-400 rounded-full" />;
    }
  };

  if (showFallback) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8 bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl shadow-gray-500/20">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-700 rounded-full flex items-center justify-center">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Experience Our AI Automation</h3>
          <p className="text-gray-300 mb-6">
            Watch our demo video to see how our AI-powered automation can transform your business operations.
          </p>
          <button
            onClick={() => window.open('/demo', '_blank')}
            className="bg-white hover:bg-gray-100 text-black font-semibold py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center mx-auto"
          >
            Watch Demo Video
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={widgetRef}
      className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl shadow-gray-500/20"
      role="region"
      aria-label="AI Automation Demo"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Experience Our AI Automation in Action
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          See how our AI-powered platform transforms raw data into actionable insights and automated workflows in real-time.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm text-gray-400 font-semibold">{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-gray-400 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8" role="list" aria-label="Automation workflow steps">
        {workflowSteps.map((step, index) => {
          const status = getStepStatus(index);
          return (
            <motion.div
              key={step.id}
              className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                status === 'completed'
                  ? 'border-gray-400/50 bg-gray-400/10'
                  : status === 'processing'
                  ? 'border-gray-500/50 bg-gray-500/10 animate-pulse'
                  : 'border-gray-600 bg-gray-800/50'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              role="listitem"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${
                  status === 'completed' ? 'bg-green-400/20' :
                  status === 'processing' ? 'bg-blue-400/20' :
                  'bg-gray-700'
                }`}>
                  {React.cloneElement(step.icon as React.ReactElement<any>, {
                    className: `w-4 h-4 ${
                      status === 'completed' ? 'text-green-400' :
                      status === 'processing' ? 'text-blue-400' :
                      'text-gray-400'
                    }`
                  })}
                </div>
                {getStatusIcon(status)}
              </div>
              <h4 className={`text-sm font-semibold mb-1 ${
                status === 'completed' ? 'text-gray-300' :
                status === 'processing' ? 'text-gray-300' :
                'text-gray-300'
              }`}>
                {step.title}
              </h4>
              <p className="text-xs text-gray-400">{step.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        {!isRunning ? (
          <motion.button
            onClick={startWorkflow}
            className="bg-white hover:bg-gray-100 text-black font-semibold py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isRunning}
            aria-label="Start automation demo"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Demo
          </motion.button>
        ) : (
          <motion.button
            onClick={() => setIsRunning(false)}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Stop automation demo"
          >
            Stop Demo
          </motion.button>
        )}

        <button
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          className="border border-gray-400 text-gray-400 hover:bg-gray-400/10 font-semibold py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center"
          aria-label="Request a custom demo"
        >
          Request Custom Demo
          <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      </div>

      {/* Live Output Display */}
      <AnimatePresence>
        {isRunning && currentStep >= 0 && (
          <motion.div
            className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2" />
              <span className="text-sm text-gray-400 font-semibold">
                Processing: {workflowSteps[currentStep]?.title}
              </span>
            </div>
            <div className="text-xs text-gray-400 font-mono bg-gray-900/50 p-2 rounded">
              {generateSimulatedOutput(currentStep)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper function to generate simulated AI output
const generateSimulatedOutput = (step: number): string => {
  const outputs = [
    "Collecting customer data from CRM, website analytics, and social media...\n✓ 1,243 records processed\n✓ Data validation complete",
    "Running machine learning algorithms on customer dataset...\n✓ Pattern recognition: 98% accuracy\n✓ Sentiment analysis: 94% confidence",
    "Generating actionable insights and recommendations...\n✓ Customer segmentation: 5 groups identified\n✓ Personalization opportunities: 12 found",
    "Creating personalized customer experiences...\n✓ Email templates: 8 variations generated\n✓ Content recommendations: 15 items suggested",
    "Deploying automated workflows across channels...\n✓ Email campaigns: 3 scheduled\n✓ Social media: 12 posts queued\n✓ SMS notifications: 45 ready"
  ];
  return outputs[step] || "Processing complete. Ready for next automation cycle.";
};

export default InteractiveDemoWidget;