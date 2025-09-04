import React from 'react';
import { 
  Search, 
  Edit, 
  Settings, 
  Rocket, 
  Check 
} from 'lucide-react';

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface ProcessStepperProps {
  currentStep: number; // 1-4, determines which step is active
  steps?: Step[]; // Array of step objects with icon, title, description
  className?: string; // Additional CSS classes
}

const ProcessStepper: React.FC<ProcessStepperProps> = ({
  currentStep = 2,
  steps,
  className = ''
}) => {
  // Default steps if not provided
  const defaultSteps: Step[] = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Discovery & Analysis",
      description: "We analyze your current processes"
    },
    {
      icon: <Edit className="w-6 h-6" />,
      title: "Solution Design",
      description: "Custom automation blueprint"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Development & Testing",
      description: "Building and refining your solution"
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "Launch & Optimize",
      description: "Going live with ongoing support"
    }
  ];

  const stepData = steps || defaultSteps;

  const getStepState = (stepIndex: number) => {
    const stepNumber = stepIndex + 1;
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'active';
    return 'upcoming';
  };

  const getStepClasses = (state: string) => {
    const baseClasses = "flex items-center transition-all duration-300";
    
    switch (state) {
      case 'completed':
        return `${baseClasses} text-green-600`;
      case 'active':
        return `${baseClasses} text-blue-600`;
      case 'upcoming':
        return `${baseClasses} text-gray-400`;
      default:
        return baseClasses;
    }
  };

  const getCircleClasses = (state: string) => {
    const baseClasses = "flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300";
    
    switch (state) {
      case 'completed':
        return `${baseClasses} bg-green-500 border-green-500 text-white`;
      case 'active':
        return `${baseClasses} bg-blue-600 border-blue-600 text-white`;
      case 'upcoming':
        return `${baseClasses} bg-gray-200 border-gray-200 text-gray-400`;
      default:
        return baseClasses;
    }
  };

  const getConnectionLineClasses = (state: string) => {
    switch (state) {
      case 'completed':
        return "bg-green-500";
      case 'active':
        return "bg-blue-600";
      default:
        return "bg-gray-200";
    }
  };

  return (
    <div 
      className={`w-full ${className}`}
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={stepData.length}
    >
      <div className="hidden md:flex items-center justify-between w-full">
        {stepData.map((step, index) => {
          const state = getStepState(index);
          const isLastStep = index === stepData.length - 1;
          
          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div className={getCircleClasses(state)}>
                  {state === 'completed' ? <Check className="w-6 h-6" /> : step.icon}
                </div>
                <div className="mt-3 text-center">
                  <div className={`text-sm font-medium ${
                    state === 'active' ? 'text-blue-600 font-semibold' :
                    state === 'completed' ? 'text-gray-900 font-medium' :
                    'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {step.description}
                  </div>
                </div>
              </div>
              
              {!isLastStep && (
                <div className={`flex-1 h-1 mx-4 ${getConnectionLineClasses(state)}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile version - vertical layout */}
      <div className="md:hidden space-y-6">
        {stepData.map((step, index) => {
          const state = getStepState(index);
          
          return (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0">
                <div className={getCircleClasses(state)}>
                  {state === 'completed' ? <Check className="w-6 h-6" /> : step.icon}
                </div>
              </div>
              
              <div className="ml-4">
                <div className={`text-sm font-medium ${
                  state === 'active' ? 'text-blue-600 font-semibold' :
                  state === 'completed' ? 'text-gray-900 font-medium' :
                  'text-gray-500'
                }`}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {step.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProcessStepper;