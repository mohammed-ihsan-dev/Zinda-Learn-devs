import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCourseById } from '../../services/courseService';
import CourseOverview from './CourseOverview';
import Loader from '../../components/Loader';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const CourseDetailsPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await getCourseById(id);
        setCourse(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Course Not Found</h1>
          <p className="text-slate-500 mb-8">{error || "The course you are looking for doesn't exist."}</p>
          <a href="/courses" className="px-8 py-3 bg-purple-600 text-white font-bold rounded-2xl shadow-xl">
            Browse Courses
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar showBackground={true} />
      <main className="pt-24 pb-20 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <CourseOverview course={course} />
      </main>
      <Footer />
    </div>
  );
};

export default CourseDetailsPage;
