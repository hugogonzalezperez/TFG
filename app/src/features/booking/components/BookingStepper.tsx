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
    <div className="bg-card border-b border-border">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex items-center justify-center gap-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${currentStep >= step.id
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground'
                  }`}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`text-sm transition-colors ${currentStep >= step.id ? 'font-medium' : 'text-muted-foreground'
                  }`}
              >
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 sm:w-16 h-0.5 ml-2 transition-colors ${currentStep > step.id ? 'bg-primary' : 'bg-border'
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
