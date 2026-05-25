import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../backend/models/User.js';
import Course from '../backend/models/Course.js';
import Enrollment from '../backend/models/Enrollment.js';
import Payout from '../backend/models/Payout.js';
import { adminService } from '../backend/services/admin.service.js';

dotenv.config({ path: '../backend/.env' });

async function run() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/zinda-learn';
    console.log('Connecting to MongoDB at:', uri);
    await mongoose.connect(uri);
    console.log('Connected!');

    const userCount = await User.countDocuments();
    const courseCount = await Course.countDocuments();
    const enrollmentCount = await Enrollment.countDocuments();
    const payoutCount = await Payout.countDocuments();

    console.log('--- Database Stats ---');
    console.log('Users:', userCount);
    console.log('Courses:', courseCount);
    console.log('Enrollments:', enrollmentCount);
    console.log('Payouts:', payoutCount);

    console.log('\n--- Running adminService.getDashboardStats() ---');
    const stats = await adminService.getDashboardStats();
    console.log('Success! Dashboard Stats fetched successfully:');
    console.log(JSON.stringify(stats, null, 2));

  } catch (error) {
    console.error('Error occurred:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

run();
