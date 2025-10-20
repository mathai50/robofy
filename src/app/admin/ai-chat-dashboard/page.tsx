import AIChatDashboard from '@/components/admin/AIChatDashboard';

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI Chat Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor AI chat performance, lead generation, and system analytics
          </p>
        </div>

        <AIChatDashboard />
      </div>
    </div>
  );
}