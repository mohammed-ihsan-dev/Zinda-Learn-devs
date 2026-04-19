import React, { useState } from "react";
import { Search, Filter } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CourseCard from "../components/CourseCard";
import Loader from "../components/Loader";
import { useCourses } from "../hooks/useCourses";

const CATEGORIES = ['All', 'Web Development', 'Mobile Development', 'Data Science', 'UI/UX Design', 'DevOps'];

const CoursesPage = () => {
  const { courses, loading, error } = useCourses();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex flex-col">
        <Navbar showBackground={true} />
        <div className="pt-40 flex-1 flex items-center justify-center">
          <Loader />
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-50 flex flex-col">
        <Navbar showBackground={true} />
        <div className="pt-40 flex-1 text-center">
          <h2 className="text-2xl font-bold text-red-500">Error</h2>
          <p className="text-surface-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar showBackground={true} />
      
      <main className="flex-grow pt-32 pb-20 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full animate-fade-in">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-zinc-900 mb-2">
            Browse Courses
          </h1>
          <p className="text-lg text-zinc-500">
            Discover new skills and accelerate your career.
          </p>
        </header>

        {/* Search & Filter Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search for courses..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            <div className="flex items-center gap-2 text-zinc-500 px-2 shrink-0">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-semibold">Filter:</span>
            </div>
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white text-zinc-600 border border-zinc-200 hover:border-primary-300 hover:text-primary-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-zinc-100">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">No results found</h3>
            <p className="text-zinc-500 max-w-sm mx-auto">
              We couldn't find any courses matching your search "{searchTerm}" in the {selectedCategory} category.
            </p>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
              className="mt-6 px-6 py-2 bg-primary-50 text-primary-600 font-semibold rounded-lg hover:bg-primary-100 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CoursesPage;
