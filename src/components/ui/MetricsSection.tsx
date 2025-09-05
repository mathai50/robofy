'use client';

import React from 'react';

interface MetricItem {
  /**
   * Unique identifier for the metric
   */
  id: string;
  /**
   * The type of progress visualization
   */
  type: 'linear' | 'circular';
  /**
   * Current progress value (0-100)
   */
  value: number;
  /**
   * Color variant for the progress bar
   */
  color?: 'blue' | 'green' | 'orange' | 'red' | 'neutral';
  /**
   * Size variant for the progress bar
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Main title/label for the metric
   */
  title: string;
  /**
   * Descriptive text shown with the metric
   */
  description?: string;
  /**
   * Detailed tooltip content shown on hover
   */
  tooltip?: string;
  /**
   * Trend indicator (improved, declined, steady)
   */
  trend?: 'up' | 'down' | 'steady';
}

interface MetricsSectionProps {
  /**
   * Title for the metrics section
   */
  title: string;
  /**
   * Description/summary for the metrics section
   */
  description?: string;
  /**
   * Array of metric items to display
   */
  metrics: MetricItem[];
  /**
   * Layout type for the metrics
   */
  layout?: 'grid' | 'list' | 'mixed';
  /**
   * Loading state for the entire section
   */
  isLoading?: boolean;
  /**
   * Whether to show section as a card with background
   */
  asCard?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

const MetricsSection: React.FC<MetricsSectionProps> = ({
  title,
  description,
  metrics,
  layout = 'grid',
  isLoading = false,
  asCard = true,
  className = '',
}) => {
  // Dynamically import the progress bar components to avoid circular dependencies
  const [LinearProgressBar, setLinearProgressBar] = React.useState<any>(null);
  const [CircularProgressBar, setCircularProgressBar] = React.useState<any>(null);

  React.useEffect(() => {
    // Import components dynamically
    import('./EnhancedLinearProgressBar').then(module => {
      setLinearProgressBar(module.default);
    });
    import('./EnhancedCircularProgressBar').then(module => {
      setCircularProgressBar(module.default);
    });
  }, []);

  if (isLoading) {
    return (
      <div className={`${asCard ? 'bg-white rounded-lg shadow-sm p-6 border' : ''} ${className}`}>
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mb-4"></div>
        {description && (
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse mb-6"></div>
        )}
        <div className={`grid grid-cols-1 md:grid-cols-${Math.min(metrics.length, 4)} gap-6`}>
          {metrics.map((metric) => (
            <div key={metric.id} className="flex flex-col items-center">
              {metric.type === 'circular' ? (
                <>
                  <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="mt-3 h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  {metric.description && (
                    <div className="mt-1 h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                  )}
                </>
              ) : (
                <>
                  <div className="w-full h-3 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="mt-2 h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  {metric.description && (
                    <div className="mt-1 h-3 bg-gray-200 rounded w-48 animate-pulse"></div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getLayoutClass = () => {
    switch (layout) {
      case 'grid':
        return `grid grid-cols-1 md:grid-cols-${Math.min(metrics.length, 4)} gap-6`;
      case 'list':
        return 'flex flex-col gap-6';
      case 'mixed':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
      default:
        return `grid grid-cols-1 md:grid-cols-${Math.min(metrics.length, 4)} gap-6`;
    }
  };

  return (
    <div className={`${asCard ? 'bg-white rounded-lg shadow-sm p-6 border' : ''} ${className}`}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
        {description && (
          <p className="text-gray-600 text-sm">{description}</p>
        )}
      </div>

      {LinearProgressBar && CircularProgressBar && (
        <div className={getLayoutClass()}>
          {metrics.map((metric) => {
            const commonProps = {
              value: metric.value,
              color: metric.color,
              size: metric.size,
              title: metric.title,
              description: metric.description,
              tooltip: metric.tooltip,
              trend: metric.trend,
            };

            return (
              <div key={metric.id} className="flex flex-col items-center">
                {metric.type === 'circular' ? (
                  <CircularProgressBar {...commonProps} />
                ) : (
                  <div className="w-full">
                    <LinearProgressBar {...commonProps} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MetricsSection;