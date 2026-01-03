import { forwardRef } from 'react';
import { cn } from '../../utils';
import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  /**
   * Override class for root element
   */
  classes?: {
    root?: string;
  };
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, classes, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(styles.input, classes?.root, className)}
        aria-invalid={error ? 'true' : undefined}
        data-nx="Input"
        data-nx-error={error || undefined}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
