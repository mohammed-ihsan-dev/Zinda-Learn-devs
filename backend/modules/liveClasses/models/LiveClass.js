import mongoose from 'mongoose';

const liveClassSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  meetingLink: {
    type: String,
    required: [true, 'Meeting link is required']
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required']
  },
  startTime: {
    type: String, // format HH:mm
    required: [true, 'Start time is required']
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 minute']
  },
  thumbnail: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['UPCOMING', 'LIVE', 'ENDED', 'CANCELLED'],
    default: 'UPCOMING'
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Indexing for faster queries
liveClassSchema.index({ instructor: 1, status: 1 });
liveClassSchema.index({ course: 1, status: 1 });
liveClassSchema.index({ scheduledDate: 1 });

const LiveClass = mongoose.model('LiveClass', liveClassSchema);
export default LiveClass;
