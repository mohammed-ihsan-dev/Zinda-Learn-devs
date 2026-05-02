import { useState } from "react";
import VideoPlayer, { LessonIcon } from "./VideoPlayer";
import { ChevronDown } from "lucide-react";

const VideoPlayerPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // 🔥 MOCK DATA (replace with real later)
  const course = {
    title: "UI Mastery: The Editorial System",
    instructor: "Elena Rodriguez",
    progress: 78,
  };

  const lessons = [
    {
      module: "Module 1: Foundations",
      items: [
        { title: "System Introduction", duration: "12:00", isFree: true, completed: true },
        { title: "The Atelier Philosophy", duration: "18:45", isFree: true, completed: true },
      ],
    },
    {
      module: "Module 2: Advanced Layout",
      items: [
        { title: "Advanced Layout Systems", duration: "52:00", isFree: true, active: true },
        { title: "Mastering Spacing", duration: "34:10", isFree: false },
      ],
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ================= LEFT SIDE ================= */}
        <div className="lg:col-span-2 space-y-6">

          {/* 🎬 VIDEO */}
          <VideoPlayer
            thumbnail="https://images.unsplash.com/photo-1518770660439-4636190af475"
            title="Advanced Layout Systems"
          />

          {/* 🔘 ACTION BUTTONS */}
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-100">
              ← Previous Lesson
            </button>

            <button className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-md">
              Next Lesson →
            </button>
          </div>

          {/* ✅ MARK COMPLETE */}
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 text-zinc-700">
            ✔ Mark as Completed
          </button>

          {/* 📑 TABS */}
          <div className="border-b flex gap-6 text-sm font-medium">
            {["overview", "notes", "qa", "resources", "tests"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 capitalize ${activeTab === tab
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-zinc-500"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 📄 CONTENT */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">
              03. Advanced Layout Systems
            </h2>

            <div className="flex gap-4 text-sm text-zinc-500">
              <span>⏱ 52 mins</span>
              <span>📊 Intermediate</span>
              <span>👥 1.2k students</span>
            </div>

            <p className="text-zinc-600">
              In this session, we explore advanced layout systems and modern UI techniques to build scalable interfaces.
            </p>

            {/* 📦 CARDS */}
            <div className="grid md:grid-cols-2 gap-4">

              <div className="bg-zinc-100 p-4 rounded-xl">
                <h4 className="font-semibold mb-2">💡 Key Takeaways</h4>
                <ul className="text-sm text-zinc-600 space-y-1">
                  <li>• Understanding layout principles</li>
                  <li>• Multi-layer UI systems</li>
                  <li>• Visual hierarchy</li>
                </ul>
              </div>

              <div className="bg-zinc-100 p-4 rounded-xl">
                <h4 className="font-semibold mb-2">🛠 Required Tools</h4>
                <ul className="text-sm text-zinc-600 space-y-1">
                  <li>• Figma Design Kit</li>
                  <li>• Tailwind CSS</li>
                  <li>• Modern browser</li>
                </ul>
              </div>

            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="space-y-6">

          {/* 👩‍🏫 INSTRUCTOR CARD */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center">
                E
              </div>
              <div>
                <p className="font-semibold">{course.instructor}</p>
                <p className="text-xs text-zinc-500">Instructor</p>
              </div>
            </div>

            <h3 className="font-bold mb-2">{course.title}</h3>

            <div className="flex justify-between text-sm mb-1">
              <span>Course Progress</span>
              <span>{course.progress}%</span>
            </div>

            <div className="w-full h-2 bg-zinc-200 rounded-full">
              <div
                className="h-full bg-purple-600 rounded-full"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>

          {/* 📚 COURSE CONTENT */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border space-y-4">
            <div className="flex justify-between">
              <h3 className="font-semibold">Course Content</h3>
              <span className="text-sm text-zinc-500">12 / 24 Lessons</span>
            </div>

            {lessons.map((module, i) => (
              <div key={i} className="space-y-2">

                <div className="flex justify-between items-center text-sm font-medium">
                  <span>{module.module}</span>
                  <ChevronDown className="w-4 h-4" />
                </div>

                {module.items.map((lesson, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-2 rounded-xl ${lesson.active ? "bg-purple-100" : ""
                      }`}
                  >
                    <LessonIcon
                      lesson={lesson}
                      isActive={lesson.active}
                      isCompleted={lesson.completed}
                    />

                    <div className="flex-1">
                      <p className="text-sm font-medium">{lesson.title}</p>
                      <p className="text-xs text-zinc-500">
                        {lesson.duration}
                      </p>
                    </div>
                  </div>
                ))}

              </div>
            ))}
          </div>

          {/* 🔥 LIVE CARD */}
          <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white p-5 rounded-2xl shadow-lg">
            <p className="text-xs mb-2">LIVE EVENT</p>
            <h3 className="font-bold mb-2">Portfolio Critique Live</h3>
            <p className="text-sm mb-4">
              Join a live session reviewing student projects.
            </p>

            <button className="w-full bg-white text-black py-2 rounded-xl font-semibold">
              Join Live Session
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPage;