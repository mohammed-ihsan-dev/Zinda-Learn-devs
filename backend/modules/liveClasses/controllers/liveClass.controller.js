import mongoose from 'mongoose';
import LiveClass from '../models/LiveClass.js';
import LiveAttendance from '../models/LiveAttendance.js';
import Course from '../../../models/Course.js';
import Enrollment from '../../../models/Enrollment.js';
import { getIO } from '../../../sockets/index.js';

// @desc    Create a new live class
// @route   POST /api/live-classes
// @access  Instructor
export const createLiveClass = async (req, res) => {
  try {
    const { title, description, courseId, meetingLink, scheduledDate, startTime, duration, thumbnail } = req.body;

    // Validate course ownership
    const course = await Course.findOne({ _id: courseId, instructor: req.user._id });
    if (!course) {
      return res.status(403).json({ success: false, message: 'You are not authorized to create a live class for this course' });
    }

    const liveClass = await LiveClass.create({
      title,
      description,
      course: courseId,
      instructor: req.user._id,
      meetingLink,
      scheduledDate,
      startTime,
      duration,
      thumbnail,
      status: 'UPCOMING'
    });

    // Notify students via Socket.IO
    const io = getIO();
    io.emit('liveClassScheduled', {
      liveClassId: liveClass._id,
      courseId: liveClass.course,
      title: liveClass.title
    });

    res.status(201).json({ success: true, data: liveClass });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a live class
// @route   PUT /api/live-classes/:id
// @access  Instructor
export const updateLiveClass = async (req, res) => {
  try {
    const liveClass = await LiveClass.findOne({ _id: req.params.id, instructor: req.user._id });
    if (!liveClass) {
      return res.status(404).json({ success: false, message: 'Live class not found or unauthorized' });
    }

    if (liveClass.status === 'ENDED') {
      return res.status(400).json({ success: false, message: 'Cannot update an ended class' });
    }

    const updatedClass = await LiveClass.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(200).json({ success: true, data: updatedClass });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a live class
// @route   DELETE /api/live-classes/:id
// @access  Instructor
export const deleteLiveClass = async (req, res) => {
  try {
    const liveClass = await LiveClass.findOne({ _id: req.params.id, instructor: req.user._id });
    if (!liveClass) {
      return res.status(404).json({ success: false, message: 'Live class not found or unauthorized' });
    }

    liveClass.isDeleted = true;
    await liveClass.save();

    res.status(200).json({ success: true, message: 'Live class deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Start a live class
// @route   PATCH /api/live-classes/:id/start
// @access  Instructor
export const startLiveClass = async (req, res) => {
  try {
    const liveClass = await LiveClass.findOne({ _id: req.params.id, instructor: req.user._id });
    if (!liveClass) {
      return res.status(404).json({ success: false, message: 'Live class not found or unauthorized' });
    }

    liveClass.status = 'LIVE';
    await liveClass.save();

    // Notify students via Socket.IO
    const io = getIO();
    io.emit('liveClassStarted', {
      liveClassId: liveClass._id,
      courseId: liveClass.course,
      title: liveClass.title
    });

    res.status(200).json({ success: true, data: liveClass });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    End a live class
// @route   PATCH /api/live-classes/:id/end
// @access  Instructor
export const endLiveClass = async (req, res) => {
  try {
    const liveClass = await LiveClass.findOne({ _id: req.params.id, instructor: req.user._id });
    if (!liveClass) {
      return res.status(404).json({ success: false, message: 'Live class not found or unauthorized' });
    }

    liveClass.status = 'ENDED';
    await liveClass.save();

    // Notify students via Socket.IO
    const io = getIO();
    io.emit('liveClassEnded', {
      liveClassId: liveClass._id,
      courseId: liveClass.course,
      title: liveClass.title
    });

    res.status(200).json({ success: true, data: liveClass });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get instructor live classes
// @route   GET /api/live-classes/instructor/all
// @access  Instructor
export const getInstructorLiveClasses = async (req, res) => {
  console.log('[LIVE_CLASS_DEBUG] Fetching classes for instructor...');
  try {
    const instructorId = req.user?._id || req.user?.id;

    if (!instructorId) {
      console.error('[LIVE_CLASS_ERROR] No instructor ID found in request');
      return res.status(401).json({ success: false, message: 'Unauthorized: No ID found' });
    }

    // Use lean() for performance and avoid complex Mongoose document issues
    // Added fallback sorting and filtering
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [liveClasses, total] = await Promise.all([
      LiveClass.find({
        instructor: instructorId,
        isDeleted: { $ne: true }
      })
        .populate('course', 'title thumbnail')
        .sort({ scheduledDate: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      LiveClass.countDocuments({
        instructor: instructorId,
        isDeleted: { $ne: true }
      })
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      data: liveClasses,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalItems: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit: Number(limit)
      }
    });

  } catch (error) {
    console.error('[LIVE_CLASS_ERROR] Critical failure in getInstructorLiveClasses:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch live classes',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Get student live classes (from enrolled courses)
// @route   GET /api/student/live-classes
// @access  Student
export const getStudentLiveClasses = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: 'Authentication data missing' });
    }

    console.log(`[LIVE_CLASS_DEBUG] Fetching live classes for student: ${req.user._id}`);

    // 1. Get all courses the student is enrolled in
    const enrollments = await Enrollment.find({ user: req.user._id });
    const enrolledCourseIds = enrollments.map(e => e.course);

    console.log(`[LIVE_CLASS_DEBUG] Student ${req.user._id} enrollments:`, enrolledCourseIds.length);
    if (enrolledCourseIds.length > 0) {
      console.log(`[LIVE_CLASS_DEBUG] Enrolled Course IDs: ${enrolledCourseIds.join(', ')}`);
    }

    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // 2. Get live classes for these courses
    const [liveClasses, total] = await Promise.all([
      LiveClass.find({
        course: { $in: enrolledCourseIds },
        isDeleted: { $ne: true },
        status: { $ne: 'CANCELLED' }
      })
        .populate('instructor', 'name avatar')
        .populate('course', 'title thumbnail')
        .sort({ scheduledDate: 1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      LiveClass.countDocuments({
        course: { $in: enrolledCourseIds },
        isDeleted: { $ne: true },
        status: { $ne: 'CANCELLED' }
      })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: liveClasses,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalItems: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('[LIVE_CLASS_ERROR] Error in getStudentLiveClasses:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching student live classes',
      error: error.message
    });
  }
};

// @desc    Get single live class details
// @route   GET /api/live-classes/:id
// @access  Private
export const getLiveClassById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.warn(`[LIVE_CLASS_WARN] Invalid live class ID: ${id}`);
      return res.status(400).json({ success: false, message: 'Invalid live class ID format' });
    }

    const liveClass = await LiveClass.findById(id)
      .populate('instructor', 'name avatar bio')
      .populate('course', 'title thumbnail');

    if (!liveClass || liveClass.isDeleted) {
      return res.status(404).json({ success: false, message: 'Live class not found' });
    }

    // Security: Check if student is enrolled if they are not the instructor
    if (req.user.role === 'student') {
      const enrollment = await Enrollment.findOne({ user: req.user._id, course: liveClass.course });
      if (!enrollment) {
        return res.status(403).json({ success: false, message: 'You are not enrolled in this course' });
      }
    } else if (req.user.role === 'instructor' && liveClass.instructor?._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    res.status(200).json({ success: true, data: liveClass });
  } catch (error) {
    console.error('[LIVE_CLASS_ERROR] Error in getLiveClassById:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching live class details',
      error: error.message
    });
  }
};

// @desc    Join live class (Attendance)
// @route   POST /api/live-classes/:id/join
// @access  Student
export const joinLiveClass = async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);
    if (!liveClass || liveClass.isDeleted) {
      return res.status(404).json({ success: false, message: 'Live class not found' });
    }

    // Enrollment check
    const enrollment = await Enrollment.findOne({ user: req.user._id, course: liveClass.course });
    if (!enrollment) {
      return res.status(403).json({ success: false, message: 'You are not enrolled in this course' });
    }

    // Join rules: Class must be LIVE or within 10 mins before start
    const now = new Date();
    const scheduledTime = new Date(liveClass.scheduledDate);
    // Parse startTime HH:mm
    const [hours, minutes] = liveClass.startTime.split(':');
    scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const diffInMinutes = (scheduledTime - now) / (1000 * 60);

    if (liveClass.status !== 'LIVE' && diffInMinutes > 10) {
      return res.status(400).json({
        success: false,
        message: 'You can only join when the class is LIVE or 10 minutes before it starts'
      });
    }

    // Track attendance
    let attendance = await LiveAttendance.findOne({ student: req.user._id, liveClass: liveClass._id });
    if (!attendance) {
      attendance = await LiveAttendance.create({
        student: req.user._id,
        liveClass: liveClass._id,
        joinedAt: now
      });
    }

    res.status(200).json({
      success: true,
      data: {
        meetingLink: liveClass.meetingLink,
        attendance
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
