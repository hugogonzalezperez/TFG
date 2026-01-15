import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
}

export function ErrorMessage({ message, onClose }: ErrorMessageProps) {
  if (!message || message.trim() === '') return null;

  return (
    <div
      className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3 transition-all"
      role="alert"
    >
      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-red-800 dark:text-red-300">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
          aria-label="Cerrar mensaje"
          type="button"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}