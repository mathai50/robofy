'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill?: boolean;
      tension?: number;
    }[];
  };
  title?: string;
  height?: number;
}

export default function LineChart({ data, title, height = 400 }: LineChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#e2e8f0',
          font: {
            size: 14,
            family: 'Alegreya, serif',
          },
        },
      },
      title: {
        display: !!title,
        text: title,
        color: '#ffffff',
        font: {
          size: 18,
          family: 'Alegreya, serif',
          weight: 'bold' as const,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y}%`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#cbd5e1',
          font: {
            size: 12,
            family: 'Alegreya, serif',
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#cbd5e1',
          font: {
            size: 12,
            family: 'Alegreya, serif',
          },
          callback: function(value: any) {
            return value + '%';
          },
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    animations: {
      tension: {
        duration: 1000,
        easing: 'linear' as const,
        from: 1,
        to: 0,
        loop: true,
      },
    },
  };

  return (
    <div
      className="w-full"
      style={{ height: `${height}px` }}
      role="img"
      aria-label={`Line chart showing ${title || 'data trends'}`}
    >
      <Line data={data} options={options} />
    </div>
  );
}