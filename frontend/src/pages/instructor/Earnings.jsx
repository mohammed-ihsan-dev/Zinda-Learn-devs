import { useState, useEffect } from 'react';
import { getInstructorCourses } from '../../services/instructorService';
import { DollarSign, TrendingUp } from 'lucide-react';

const Earnings = () => {
  const [stats, setStats] = useState({ totalEarnings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const data = await getInstructorCourses();
      const courses = data.courses || [];
      const totalEarnings = courses.reduce((acc, c) => acc + ((c.totalStudents || 0) * (c.price || 0)), 0);
      setStats({ totalEarnings });
    } catch (error) {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-surface-900">Earnings</h2>
        <p className="text-surface-500">Track your revenue from course enrollments</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-surface-100 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
              <DollarSign className="w-8 h-8" />
            </div>
            <p className="text-sm font-medium text-surface-500 uppercase tracking-widest">Total Revenue</p>
            <h3 className="text-5xl font-black text-surface-900 mt-2">${stats.totalEarnings.toFixed(2)}</h3>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-bold text-surface-900">Recent Transactions</h3>
            </div>
            <div className="text-center py-12 text-surface-500 bg-surface-50 rounded-xl border border-dashed border-surface-200">
              No transaction history available yet.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Earnings;
