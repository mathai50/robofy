// Chart data for KPI and ROI visualization
// Color palette aligned with brand: electric blue, green, purple, pink, etc.

export const lineChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Process Efficiency',
      data: [65, 72, 78, 82, 85, 88, 90, 92, 94, 95, 96, 97],
      borderColor: '#3b82f6', // electric blue
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
    },
    {
      label: 'Automation Rate',
      data: [45, 55, 65, 72, 78, 83, 87, 90, 92, 94, 95, 96],
      borderColor: '#10b981', // green
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4,
    },
    {
      label: 'Error Reduction',
      data: [70, 75, 80, 84, 87, 89, 91, 93, 94, 95, 96, 97],
      borderColor: '#8b5cf6', // purple
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      fill: true,
      tension: 0.4,
    },
  ],
};

export const barChartData = {
  labels: ['Marketing', 'Sales', 'Operations', 'Customer Support', 'IT'],
  datasets: [
    {
      label: 'Cost Savings (%)',
      data: [45, 60, 75, 50, 80],
      backgroundColor: '#3b82f6', // blue
      borderColor: '#2563eb',
      borderWidth: 1,
      borderRadius: 6,
    },
    {
      label: 'Revenue Increase (%)',
      data: [35, 55, 65, 40, 70],
      backgroundColor: '#10b981', // green
      borderColor: '#059669',
      borderWidth: 1,
      borderRadius: 6,
    },
    {
      label: 'Productivity Gain (%)',
      data: [50, 65, 80, 55, 85],
      backgroundColor: '#8b5cf6', // purple
      borderColor: '#7c3aed',
      borderWidth: 1,
      borderRadius: 6,
    },
  ],
};

export const donutChartData = {
  labels: ['Marketing', 'Sales', 'Operations', 'Customer Support', 'IT', 'HR'],
  datasets: [
    {
      label: 'Workflows Automated',
      data: [25, 20, 15, 15, 15, 10],
      backgroundColor: [
        '#3b82f6', // blue
        '#10b981', // green
        '#8b5cf6', // purple
        '#ec4899', // pink
        '#f59e0b', // amber
        '#06b6d4', // cyan
      ],
      borderColor: [
        '#2563eb',
        '#059669',
        '#7c3aed',
        '#db2777',
        '#d97706',
        '#0891b2',
      ],
      borderWidth: 2,
    },
  ],
};

// Additional data for different chart variations
export const roiByProjectData = {
  labels: ['Project Alpha', 'Project Beta', 'Project Gamma', 'Project Delta'],
  datasets: [
    {
      label: 'ROI (%)',
      data: [120, 180, 150, 200],
      backgroundColor: [
        '#3b82f6',
        '#10b981',
        '#8b5cf6',
        '#ec4899',
      ],
      borderColor: [
        '#2563eb',
        '#059669',
        '#7c3aed',
        '#db2777',
      ],
      borderWidth: 1,
      borderRadius: 6,
    },
  ],
};

export const timeSavingsData = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    {
      label: 'Time Saved (hours)',
      data: [1200, 1800, 2400, 3000],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
    },
  ],
};

// Export all data for easy import
export default {
  lineChartData,
  barChartData,
  donutChartData,
  roiByProjectData,
  timeSavingsData,
};