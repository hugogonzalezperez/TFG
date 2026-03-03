import { Check } from 'lucide-react';

interface BookingStepperProps {
  currentStep: number;
}

export function BookingStepper({ currentStep }: BookingStepperProps) {
  const steps = [
    { id: 1, label: 'Información' },
    { id: 2, label: 'Pago' },
    { id: 3, label: 'Confirmación' },
  ];

  return (
    <div className="bg-card border-b border-border sticky top-0 z-10 backdrop-blur-sm bg-background/95">
      <div className="max-w-5xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-center sm:gap-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors text-xs sm:text-sm ${currentStep >= step.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-muted text-muted-foreground'
                    }`}
                >
                  {currentStep > step.id ? (
                    <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={`hidden sm:inline text-sm transition-colors ${currentStep >= step.id ? 'font-bold' : 'text-muted-foreground'
                    }`}
                >
                  {step.label}
                </span>

                {/* Mobile Label snippet: only if active */}
                {currentStep === step.id && (
                  <span className="sm:hidden text-xs font-bold ml-1 text-primary animate-in fade-in slide-in-from-left-2">
                    {step.label}
                  </span>
                )}
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 transition-colors ${currentStep > step.id ? 'bg-primary' : 'bg-border'
                    }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
