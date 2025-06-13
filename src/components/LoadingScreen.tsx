import { useState, useEffect } from "react";
import { FileText, Brain, CheckCircle, Target, Sparkles } from "lucide-react";
import React from "react";

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    {
      icon: FileText,
      title: "Parsing your resume...",
      description: "Extracting text and analyzing document structure",
      duration: 2000
    },
    {
      icon: Brain,
      title: "AI analysis in progress...",
      description: "Evaluating content quality, keywords, and formatting",
      duration: 2500
    },
    {
      icon: Target,
      title: "Checking ATS compatibility...",
      description: "Testing how well your resume works with applicant tracking systems",
      duration: 2000
    },
    {
      icon: CheckCircle,
      title: "Generating personalized feedback...",
      description: "Creating specific recommendations based on industry best practices",
      duration: 1500
    }
  ];

  useEffect(() => {
    const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);
    let elapsed = 0;

    const progressTimer = setInterval(() => {
      elapsed += 50;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(newProgress);

      // Update current step based on elapsed time
      let accumulatedTime = 0;
      for (let i = 0; i < steps.length; i++) {
        accumulatedTime += steps[i].duration;
        if (elapsed < accumulatedTime) {
          setCurrentStep(i);
          break;
        }
      }

      if (elapsed >= totalDuration) {
        clearInterval(progressTimer);
        setTimeout(() => onComplete(), 500);
      }
    }, 50);

    return () => clearInterval(progressTimer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-6">
        {/* Animated Logo */}
        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center mb-8 mx-auto animate-pulse">
          <Sparkles className="w-10 h-10 text-white" />
        </div>

        {/* Main Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Analyzing Your Resume
        </h2>
        <p className="text-gray-600 mb-8">
          Our AI is working hard to give you the best feedback possible
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-8 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-600 to-green-600 h-3 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Current Step */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              {steps[currentStep] && React.createElement(steps[currentStep].icon, {
                className: "w-6 h-6 text-blue-600"
              })}
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">
                {steps[currentStep]?.title}
              </h3>
              <p className="text-sm text-gray-600">
                {steps[currentStep]?.description}
              </p>
            </div>
          </div>

          {/* Step Progress Indicators */}
          <div className="flex justify-center space-x-2 mt-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Fun Facts */}
        <div className="mt-8 text-sm text-gray-500">
          <p className="mb-2">💡 <strong>Did you know?</strong></p>
          <p>Most recruiters spend only 6 seconds reviewing a resume initially</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
