import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Conversation from './backend/models/Conversation.js';
import User from './backend/models/User.js';
import Course from './backend/models/Course.js';

dotenv.config();

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    const conversations = await Conversation.find({}).limit(1);
    console.log('Test Query successful:', conversations);
    
    process.exit(0);
  } catch (error) {
    console.error('Test Query failed:', error);
    process.exit(1);
  }
}

test();
