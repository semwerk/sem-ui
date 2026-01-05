import { forwardRef, ReactNode } from 'react';
import { cn } from '../../../utils';

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      title,
      value,
      description,
      icon,
      trend,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border border-gray-200 bg-white p-4',
          className
        )}
        {...props}
      >
        <div className="flex flex-row items-center justify-between pb-2">
          <h3 className="text-sm font-medium text-gray-600">
            {title}
          </h3>
          {icon && (
            <div className="text-gray-600">
              {icon}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <div className="text-2xl font-bold text-gray-900">
            {value}
          </div>
          {(description || trend) && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              {trend && (
                <span
                  className={cn(
                    'font-medium',
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {trend.isPositive ? '+' : ''}
                  {trend.value}%
                </span>
              )}
              {description && <span>{description}</span>}
            </div>
          )}
        </div>
      </div>
    );
  }
);

StatCard.displayName = 'StatCard';
