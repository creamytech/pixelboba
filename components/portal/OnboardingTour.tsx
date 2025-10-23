'use client';

import { useState } from 'react';
import Joyride, { CallBackProps, STATUS, Step, TooltipRenderProps } from 'react-joyride';
import { motion } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';

interface OnboardingTourProps {
  run: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

// Custom tooltip component with brand styling
function CustomTooltip({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  tooltipProps,
  skipProps,
  size,
  isLastStep,
}: TooltipRenderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      {...tooltipProps}
      className="relative bg-white rounded-xl shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] border-4 border-ink p-6 max-w-md"
    >
      {/* Close button */}
      <button
        {...closeProps}
        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-cream border-2 border-transparent hover:border-ink transition-all"
      >
        <X className="w-4 h-4 text-ink" />
      </button>

      {/* Progress indicator */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black text-ink uppercase">
            Step {index + 1} of {size}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: size }).map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all border-2 border-ink ${
                  i === index ? 'w-8 bg-taro' : i < index ? 'w-2 bg-matcha' : 'w-2 bg-cream'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Step title */}
      {step.title && (
        <h3 className="font-display font-black text-xl text-ink mb-2 uppercase">{step.title}</h3>
      )}

      {/* Step content */}
      <div className="text-ink/70 mb-6 font-bold">{step.content}</div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between gap-3">
        <button
          {...skipProps}
          className="text-sm text-ink/60 hover:text-ink transition-colors font-bold uppercase"
        >
          Skip Tour
        </button>

        <div className="flex gap-2">
          {index > 0 && (
            <button
              {...backProps}
              className="px-4 py-2 rounded-full bg-white text-ink font-black border-3 border-ink uppercase shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] hover:shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}

          <button
            {...primaryProps}
            className="px-6 py-3 rounded-full bg-matcha text-ink font-black border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] uppercase transition-all flex items-center gap-2"
          >
            {isLastStep ? (
              <>
                <Check className="w-4 h-4" />
                Got it!
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function OnboardingTour({ run, onComplete, onSkip }: OnboardingTourProps) {
  const [stepIndex, setStepIndex] = useState(0);

  const steps: Step[] = [
    {
      target: 'body',
      content: (
        <div>
          <p className="mb-4">Welcome to your Pixel Boba Client Portal! 🧋</p>
          <p className="text-sm">
            Let&apos;s take a quick tour to help you get started. This will only take a minute!
          </p>
        </div>
      ),
      title: 'Welcome!',
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: 'body',
      content: (
        <div>
          <h4 className="font-semibold text-ink mb-3">Your Dashboard</h4>
          <p className="mb-3">The main dashboard gives you an overview of everything:</p>
          <ul className="text-sm text-ink/70 space-y-2 my-3">
            <li className="flex items-start gap-2">
              <span className="text-taro">•</span>
              <div>
                <strong>Key Metrics</strong> - Active projects, completed tasks, pending items, and
                overall progress
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-taro">•</span>
              <div>
                <strong>Your Projects</strong> - View progress, tasks, and deadlines for each active
                project
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-taro">•</span>
              <div>
                <strong>Recent Activity</strong> - Track the latest updates, messages, and
                milestones
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-taro">•</span>
              <div>
                <strong>Quick Access Buttons</strong> - Messages, Invoices, and Contracts shortcuts
                at the bottom
              </div>
            </li>
          </ul>
          <p className="text-sm text-ink/60 mt-3">
            Everything updates in real-time as your projects progress!
          </p>
        </div>
      ),
      title: 'Dashboard Overview',
      placement: 'center',
    },
    {
      target: 'body',
      content: (
        <div>
          <p className="mb-3">
            Use the sidebar on the left to navigate between different sections:
          </p>
          <ul className="text-sm text-ink/70 space-y-2 my-3">
            <li className="flex items-start gap-2">
              <span className="text-taro">•</span>
              <div>
                <strong>Tasks</strong> - Manage project tasks on a kanban board (you can add to
                Todo/Backlog)
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-taro">•</span>
              <div>
                <strong>Messages</strong> - Chat with your project manager in real-time
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-taro">•</span>
              <div>
                <strong>Invoices</strong> - View and pay invoices securely
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-taro">•</span>
              <div>
                <strong>Contracts</strong> - Review and eSign contracts with DocuSign
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-taro">•</span>
              <div>
                <strong>Files</strong> - Access all project files and uploads
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-taro">•</span>
              <div>
                <strong>Notifications</strong> - Stay updated on all project activity
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-taro">•</span>
              <div>
                <strong>Settings</strong> - Manage your notification preferences
              </div>
            </li>
          </ul>
          <p className="text-sm text-ink/60 mt-3">Click any tab to explore that section!</p>
        </div>
      ),
      title: 'Portal Navigation',
      placement: 'center',
    },
    {
      target: 'body',
      content: (
        <div>
          <p className="mb-4">You&apos;re all set! 🎉</p>
          <p className="text-sm text-ink/60 mb-4">
            You can replay this tour anytime from the <strong>Settings</strong> tab. If you have any
            questions, don&apos;t hesitate to message us!
          </p>
          <p className="text-sm font-medium text-taro">
            Ready to get started? Let&apos;s build something amazing together! 🧋
          </p>
        </div>
      ),
      title: 'Tour Complete',
      placement: 'center',
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index, type } = data;

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      if (status === STATUS.SKIPPED) {
        onSkip();
      } else {
        onComplete();
      }
    }

    if (type === 'step:after') {
      setStepIndex(index + 1);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      hideCloseButton={false}
      disableOverlayClose
      disableCloseOnEsc={false}
      spotlightClicks={true}
      callback={handleJoyrideCallback}
      tooltipComponent={CustomTooltip}
      stepIndex={stepIndex}
      styles={{
        options: {
          zIndex: 10000,
          arrowColor: 'transparent',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          mixBlendMode: 'normal',
        },
        spotlight: {
          display: 'none',
        },
      }}
    />
  );
}
