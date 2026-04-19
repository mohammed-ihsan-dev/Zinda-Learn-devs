import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: [true, 'Message cannot be empty'],
    trim: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  attachments: [{
    filename: String,
    url: String,
    type: String
  }]
}, { timestamps: true });

messageSchema.index({ sender: 1, receiver: 1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;

