import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
}

export function ErrorMessage({ message, onClose }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className="mb-6 p-4 bg-destructive/10 border-2 border-destructive/30 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
      <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-destructive">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-destructive/70 hover:text-destructive transition-colors"
          aria-label="Cerrar mensaje"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}