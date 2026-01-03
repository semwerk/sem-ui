import { forwardRef } from 'react';
import { cn } from '../../utils';
import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(styles.input, className)}
        aria-invalid={error ? 'true' : undefined}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
