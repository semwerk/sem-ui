import { forwardRef } from 'react';
import { cn } from '../../utils';
import styles from './Badge.module.css';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'error';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return <span ref={ref} className={cn(styles.badge, styles[variant], className)} {...props} />;
  }
);

Badge.displayName = 'Badge';
