import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'default' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'default',
      size = 'default',
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
      default: 'bg-primary-600 text-white hover:bg-primary-700',
      outline:
        'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
      ghost: 'hover:bg-gray-100',
      link: 'text-primary-600 hover:underline',
    };

    const sizes = {
      sm: 'h-9 px-3 text-sm',
      default: 'h-10 py-2 px-4',
      lg: 'h-11 px-8',
    };

    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
