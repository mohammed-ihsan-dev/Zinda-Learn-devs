import Review from '../models/Review.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

// @desc    Get reviews for a course
// @route   GET /api/courses/:courseId/reviews
// @access  Public
export const getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const query = { course: courseId };

    const reviews = await Review.find(query)
      .populate('user', 'name avatar')
      .sort('-createdAt')
      .skip(startIndex)
      .limit(limit);

    const total = await Review.countDocuments(query);

    res.status(200).json({
      success: true,
      count: reviews.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add review
// @route   POST /api/courses/:courseId/reviews
// @access  Private (Student Only)
export const addReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    req.body.course = courseId;
    req.body.user = req.user.id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if user is enrolled
    const enrollment = await Enrollment.findOne({ course: courseId, user: req.user.id });
    if (!enrollment) {
      return res.status(403).json({ success: false, message: 'Only enrolled students can review this course' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ course: courseId, user: req.user.id });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this course' });
    }

    const review = await Review.create(req.body);

    res.status(201).json({
      success: true,
      review
    });
  } catch (error) {
    // Check for mongoose duplicate key error
    if (error.code === 11000) {
       return res.status(400).json({ success: false, message: 'You have already reviewed this course' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update review
// @route   PUT /api/courses/:courseId/reviews/:id
// @access  Private
export const updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Make sure review belongs to user
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this review' });
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/courses/:courseId/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Make sure review belongs to user or user is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Review removed'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
