import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById, enrollInCourse } from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { CheckCircle2 } from 'lucide-react';

// Components
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CourseHero from '../../components/course/CourseHero';
import CourseSidebar from '../../components/course/CourseSidebar';
import CourseCurriculum from '../../components/course/CourseCurriculum';
import CourseInstructorCard from '../../components/course/CourseInstructorCard';
import CourseSkeleton from '../../components/course/CourseSkeleton';

const CourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await getCourseById(id);
        
        // If already enrolled, direct to learning page
        if (data.enrolled) {
           navigate(`/student/my-learning?course=${id}`); 
           return;
        }

        setCourse(data);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError(err.response?.data?.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, navigate]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to enroll');
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }

    try {
      setEnrolling(true);
      const loadingToast = toast.loading('Enrolling you in the course...');
      
      await enrollInCourse(id);
      
      toast.success('Successfully enrolled!', { id: loadingToast });
      
      // Redirect to learning page
      setTimeout(() => {
        navigate(`/student/my-learning?course=${id}`);
      }, 1500);
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enrollment failed');
      setEnrolling(false);
    }
  };

  const handleContinue = () => {
    navigate(`/student/my-learning?course=${id}`);
  };

  if (loading) return <CourseSkeleton />;

  if (error || !course) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <Navbar showBackground={true} />
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Course not found</h2>
          <p className="text-gray-500 mb-8">{error || "The course you're looking for might have been moved or deleted."}</p>
          <button 
            onClick={() => navigate('/courses')}
            className="px-8 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors"
          >
            Browse all courses
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar showBackground={true} />
      
      <CourseHero course={course} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:flex gap-12 relative">
          
          {/* Main Content */}
          <div className="lg:w-2/3">
            
            {/* What you'll learn */}
            <div className="border border-gray-200 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What you'll learn</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {(course.whatYouWillLearn?.length > 0 ? course.whatYouWillLearn : [
                  "Master the core concepts of the subject from scratch",
                  "Build real-world projects to reinforce learning",
                  "Learn best practices and industry standards",
                  "Get lifetime access to course materials"
                ]).map((item, index) => (
                  <div key={index} className="flex gap-3 text-sm text-gray-700">
                    <CheckCircle2 size={18} className="text-gray-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <div className="prose prose-purple max-w-none text-gray-700">
                <div dangerouslySetInnerHTML={{ __html: course.description }} />
              </div>
            </div>

            {/* Requirements */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {(course.requirements?.length > 0 ? course.requirements : [
                  "No prior experience required",
                  "A computer with internet access",
                  "Passion to learn and grow"
                ]).map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            {/* Curriculum */}
            <CourseCurriculum modules={course.modules} />

            {/* Instructor */}
            <CourseInstructorCard instructor={course.instructor} />

          </div>

          {/* Sidebar - Desktop Sticky Container */}
          <div className="lg:w-1/3">
            <CourseSidebar 
              course={course} 
              enrolled={course.enrolled}
              enrolling={enrolling}
              onEnroll={handleEnroll}
              onContinue={handleContinue}
            />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CourseDetailsPage;
