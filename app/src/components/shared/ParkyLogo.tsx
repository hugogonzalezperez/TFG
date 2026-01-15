import { Car } from 'lucide-react';

interface ParkyLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  onClick?: () => void;
}

export function ParkyLogo({ size = 'md', showText = true, onClick }: ParkyLogoProps) {
  const sizeClasses = {
    sm: { icon: 'h-5 w-5', padding: 'p-2', text: 'text-xl', rounded: 'rounded-xl' },
    md: { icon: 'h-6 w-6', padding: 'p-2', text: 'text-2xl', rounded: 'rounded-xl' },
    lg: { icon: 'h-8 w-8', padding: 'p-3', text: 'text-3xl', rounded: 'rounded-2xl' },
  };

  const classes = sizeClasses[size];

  return (
    <div
      className={`flex items-center ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className={`bg-primary ${classes.padding} ${classes.rounded}`}>
        <Car className={`${classes.icon} text-white`} />
      </div>
      {showText && (
        <h1 className={`ml-2 ${classes.text} font-bold text-foreground`}>Parky</h1>
      )}
    </div>
  );
}
