import { Input, Label } from '../ui';
import { LucideIcon } from 'lucide-react';

interface FormInputProps {
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: LucideIcon;
  required?: boolean;
  disabled?: boolean;
  minLength?: number;
  min?: string;
  className?: string;
  onIconClick?: () => void;
  iconRight?: LucideIcon;
}

export function FormInput({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  icon: Icon,
  required = false,
  disabled = false,
  minLength,
  min,
  className = '',
  onIconClick,
  iconRight: IconRight,
}: FormInputProps) {
  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        )}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`${Icon ? 'pl-10' : ''} ${IconRight ? 'pr-10' : ''} ${className}`}
          required={required}
          disabled={disabled}
          minLength={minLength}
          min={min}
        />
        {IconRight && (
          <button
            type="button"
            onClick={onIconClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            disabled={disabled}
          >
            <IconRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}