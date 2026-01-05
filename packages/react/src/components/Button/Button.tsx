import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../utils';
import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  asChild?: boolean;
  /**
   * Override classes for component slots
   */
  classes?: {
    root?: string;
    spinner?: string;
  };
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      asChild = false,
      classes,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        className={cn(
          styles.button,
          styles[variant],
          styles[size],
          loading && styles.loading,
          classes?.root,
          className
        )}
        disabled={disabled || loading}
        data-nx="Button"
        data-nx-variant={variant}
        data-nx-size={size}
        data-nx-loading={loading || undefined}
        {...props}
      >
        {asChild ? (
          // Slot requires exactly one child element - pass children directly
          children
        ) : (
          // Regular button can have spinner + children
          <>
            {loading && (
              <span
                className={cn(styles.spinner, classes?.spinner)}
                data-nx-slot="spinner"
                aria-hidden="true"
              />
            )}
            {children}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';
