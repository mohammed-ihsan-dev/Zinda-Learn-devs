import mongoose from 'mongoose';
import slugify from 'slugify';

/* =========================
   LESSON SCHEMA
========================= */
const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 0
  },
  isFree: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    required: true
  }
});

/* =========================
   MODULE SCHEMA
========================= */
const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  lessons: [lessonSchema],
  order: {
    type: Number,
    required: true
  }
});

/* =========================
   COURSE SCHEMA
========================= */
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a course title'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },

  slug: {
    type: String,
    unique: true,
    sparse: true
  },

  description: {
    type: String,
    required: [true, 'Please provide a course description']
  },

  shortDescription: {
    type: String,
    maxlength: [300, 'Short description cannot exceed 300 characters']
  },

  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price must be positive']
  },

  discountPrice: {
    type: Number,
    default: 0,
    validate: {
      validator: function (value) {
        // If price is 0 (free), discount should be 0. Otherwise, discount must be less than price.
        return value === 0 || value < this.price;
      },
      message: 'Discount price must be less than original price'
    }
  },

  currency: {
    type: String,
    default: 'INR',
    enum: ['INR']
  },

  thumbnail: {
    type: String,
    default: ''
  },

  previewVideo: {
    type: String,
    default: ''
  },

  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['development', 'business', 'design', 'marketing', 'it', 'finance']
  },

  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'All Levels'],
    default: 'All Levels'
  },

  language: {
    type: String,
    default: 'English'
  },

  tags: [String],
  modules: [moduleSchema],
  requirements: [String],
  whatYouWillLearn: [String],

  totalStudents: {
    type: Number,
    default: 0
  },

  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },

  totalRatings: {
    type: Number,
    default: 0
  },

  /* =========================
     STATUS & WORKFLOW
  ========================= */

  isPublished: {
    type: Boolean,
    default: false
  },

  isApproved: {
    type: Boolean,
    default: false
  },

  status: {
    type: String,
    enum: ['draft', 'pending', 'published', 'declined'],
    default: 'draft'
  },

  declineReason: {
    type: String,
    default: ''
  },

  submittedAt: Date,
  reviewedAt: Date,

  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  /* =========================
     SYSTEM FIELDS
  ========================= */

  isDeleted: {
    type: Boolean,
    default: false
  },

  enrollmentsCount: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

/* =========================
   VIRTUALS
========================= */

courseSchema.virtual('totalLessons').get(function () {
  return this.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
});

courseSchema.virtual('totalDuration').get(function () {
  return this.modules.reduce((acc, mod) => {
    return acc + mod.lessons.reduce((a, l) => a + l.duration, 0);
  }, 0);
});

courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

/* =========================
   INDEXES
========================= */

courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ category: 1 });
courseSchema.index({ price: 1 });
courseSchema.index({ createdAt: -1 });
courseSchema.index({ status: 1, isApproved: 1 });
courseSchema.index({ title: 1, instructor: 1 }, { unique: true });

/* =========================
   MIDDLEWARE
========================= */

courseSchema.pre('save', function (next) {

  // Generate slug
  if (this.isModified('title') || !this.slug) {
    const baseSlug = slugify(this.title, { lower: true, strict: true });
    this.slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
  }

  // Status logic enforcement
  if (this.status === 'published') {
    this.isApproved = true;
    this.isPublished = true;
  }

  if (this.status === 'declined') {
    this.isApproved = false;
    this.isPublished = false;
  }

  // Auto set submitted time
  if (this.status === 'pending' && !this.submittedAt) {
    this.submittedAt = new Date();
  }

  next();
});

/* =========================
   MODEL EXPORT
========================= */

const Course = mongoose.model('Course', courseSchema);
export default Course;