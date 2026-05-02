import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

// Get user enrollments
export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id })
      .populate({
        path: "course",
        populate: {
          path: "instructor",
          select: "name avatar bio"
        }
      })
      .sort({ createdAt: -1 });

    // Filter out enrollments where the course no longer exists
    const validEnrollments = enrollments.filter(e => e.course !== null);

    res.status(200).json({
      success: true,
      enrollments: validEnrollments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update progress
export const updateProgress = async (req, res) => {
  try {
    const { lessonId, moduleIndex, lessonIndex } = req.body;

    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found"
      });
    }

    if (enrollment.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    if (lessonId && !enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    if (
      moduleIndex !== undefined &&
      lessonIndex !== undefined
    ) {
      enrollment.currentLesson = { moduleIndex, lessonIndex };
    }

    const course = await Course.findById(enrollment.course);

    const totalLessons = course.modules.reduce(
      (acc, mod) => acc + mod.lessons.length,
      0
    );

    enrollment.progress =
      totalLessons > 0
        ? Math.round(
          (enrollment.completedLessons.length / totalLessons) * 100
        )
        : 0;

    if (enrollment.progress >= 100) {
      enrollment.isCompleted = true;
      enrollment.completedAt = new Date();
    }

    await enrollment.save();

    res.status(200).json({
      success: true,
      enrollment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get instructor stats
export const getInstructorStats = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id });

    const courseIds = courses.map((c) => c._id);

    const enrollments = await Enrollment.find({
      course: { $in: courseIds }
    });

    const totalRevenue = enrollments.reduce(
      (acc, e) => acc + e.amountPaid,
      0
    );

    const totalStudents = new Set(
      enrollments.map((e) => e.user.toString())
    ).size;

    res.status(200).json({
      success: true,
      stats: {
        totalCourses: courses.length,
        totalStudents,
        totalRevenue,
        totalEnrollments: enrollments.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Direct Enrollment (Free/No Payment Session)
// @route   POST /api/enrollments/enroll
// @access  Private
export const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Check if already enrolled
    const existing = await Enrollment.findOne({ user: req.user.id, course: courseId });
    if (existing && (existing.paymentStatus === 'completed' || existing.paymentStatus === 'free')) {
      return res.status(400).json({ success: false, message: "Already enrolled in this course" });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      user: req.user.id,
      course: courseId,
      paymentStatus: 'free',
      amountPaid: 0
    });

    // Update course and user
    await Promise.all([
      Course.findByIdAndUpdate(courseId, { $inc: { totalStudents: 1 } }),
      User.findByIdAndUpdate(req.user.id, { $addToSet: { enrolledCourses: courseId } })
    ]);

    // Trigger notification
    try {
      const { notificationService } = await import('../services/notification.service.js');
      await notificationService.createNotification({
        userId: req.user.id,
        title: "Course Enrolled",
        message: `You have successfully enrolled in "${course.title}". Enjoy your learning journey!`,
        type: "success"
      });
    } catch (notifErr) {
      console.error("Notification failed:", notifErr);
    }

    res.status(200).json({
      success: true,
      message: "Enrolled successfully",
      enrollment
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};