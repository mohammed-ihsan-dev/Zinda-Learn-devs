import { useState, useEffect, useCallback } from 'react';
import socketService from '../../../services/socket';
import liveClassService from '../services/liveClassService';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-hot-toast';

export const useLiveClasses = (initialParams = {}) => {
  const { token } = useAuth();
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10
  });

  const fetchLiveClasses = useCallback(async (params = initialParams) => {
    try {
      setLoading(true);
      const response = await liveClassService.getStudentLiveClasses(params);
      if (response.success) {
        setLiveClasses(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (error) {
      console.error('Failed to fetch live classes:', error);
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  useEffect(() => {
    if (token) {
      socketService.connect(token);
    }
    
    fetchLiveClasses(initialParams);

    // Socket listeners handlers
    const handleStarted = ({ liveClassId, title }) => {
      toast.success(`Live Class Started: ${title}`, {
        icon: '🔴',
        duration: 5000
      });
      // Update state if exists, otherwise refetch to get the new live class
      setLiveClasses(prev => {
        const exists = prev.find(c => c._id === liveClassId);
        if (exists) {
          return prev.map(c => c._id === liveClassId ? { ...c, status: 'LIVE' } : c);
        } else {
          fetchLiveClasses(initialParams); // Fetch if it's a new class we didn't have
          return prev;
        }
      });
    };

    const handleEnded = ({ liveClassId, title }) => {
      toast.error(`Live Class Ended: ${title}`, {
        icon: '⚪',
        duration: 5000
      });
      setLiveClasses(prev => prev.map(c => 
        c._id === liveClassId ? { ...c, status: 'ENDED' } : c
      ));
    };

    const handleScheduled = ({ title }) => {
      toast.success(`New Live Class Scheduled: ${title}`, {
        icon: '📅'
      });
      fetchLiveClasses(initialParams);
    };

    // Bind listeners using global service helpers
    socketService.onLiveClassStarted(handleStarted);
    socketService.onLiveClassEnded(handleEnded);
    socketService.onLiveClassScheduled(handleScheduled);

    return () => {
      // Cleanup listeners
      socketService.offLiveClassStarted();
      socketService.offLiveClassEnded();
      socketService.offLiveClassScheduled();
    };
  }, [token, fetchLiveClasses, JSON.stringify(initialParams)]);

  return { liveClasses, loading, pagination, refetch: fetchLiveClasses };
};
