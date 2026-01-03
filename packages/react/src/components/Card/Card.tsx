import { forwardRef } from 'react';
import { cn } from '../../utils';
import styles from './Card.module.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn(styles.card, className)} {...props} />;
});

Card.displayName = 'Card';
