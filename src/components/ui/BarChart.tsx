'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor?: string;
      borderWidth?: number;
      borderRadius?: number;
    }[];
  };
  title?: string;
  height?: number;
}

export default function BarChart({ data, title, height = 400 }: BarChartProps) {
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
    animation: {
      duration: 1000,
      easing: 'easeOutQuart' as const,
    },
  };

  return (
    <div
      className="w-full"
      style={{ height: `${height}px` }}
      role="img"
      aria-label={`Bar chart showing ${title || 'data comparison'}`}
    >
      <Bar data={data} options={options} />
    </div>
  );
}