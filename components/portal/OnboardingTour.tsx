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
      className="relative bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-taro/20 p-6 max-w-md"
    >
      {/* Gradient decoration */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-taro to-brown-sugar rounded-full blur-3xl opacity-20" />

      {/* Close button */}
      <button
        {...closeProps}
        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-brown-sugar/10 transition-colors"
      >
        <X className="w-4 h-4 text-ink/60" />
      </button>

      {/* Progress indicator */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-taro">
            Step {index + 1} of {size}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: size }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === index
                    ? 'w-8 bg-taro'
                    : i < index
                      ? 'w-1.5 bg-matcha'
                      : 'w-1.5 bg-brown-sugar/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Step title */}
      {step.title && <h3 className="font-display font-bold text-xl text-ink mb-2">{step.title}</h3>}

      {/* Step content */}
      <div className="text-ink/70 mb-6">{step.content}</div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between gap-3">
        <button
          {...skipProps}
          className="text-sm text-ink/60 hover:text-ink/80 transition-colors font-medium"
        >
          Skip Tour
        </button>

        <div className="flex gap-2">
          {index > 0 && (
            <button
              {...backProps}
              className="px-4 py-2 rounded-lg border-2 border-brown-sugar/20 text-ink font-medium hover:bg-brown-sugar/10 transition-all flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}

          <button
            {...primaryProps}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-taro to-brown-sugar text-white font-medium hover:shadow-lg transition-all flex items-center gap-2"
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
                <strong>Project Cards</strong> - View progress, tasks, and deadlines for each
                project
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-taro">•</span>
              <div>
                <strong>Recent Activity</strong> - Stay updated on the latest changes and updates
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-taro">•</span>
              <div>
                <strong>Quick Actions</strong> - Jump directly to messages, invoices, or contracts
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
