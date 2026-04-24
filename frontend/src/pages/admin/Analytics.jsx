import { BarChart3 } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-surface-900">Analytics & Reports</h2>
        <p className="text-surface-500">Detailed overview of platform performance</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-12 text-center">
        <BarChart3 className="w-16 h-16 text-surface-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-surface-900 mb-2">Detailed Analytics Coming Soon</h3>
        <p className="text-surface-500 max-w-md mx-auto">
          We are building comprehensive charts and insights for revenue and enrollments. Stay tuned for the next update!
        </p>
      </div>
    </div>
  );
};

export default Analytics;
