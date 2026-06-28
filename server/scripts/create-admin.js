import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const createAdmin = async () => {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] || 'Secondary Admin';

  if (!email || !password) {
    console.log('\n❌ Missing arguments.');
    console.log('Usage: node server/scripts/create-admin.js <email> <password> "[name]"\n');
    process.exit(1);
  }

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined in .env');
    }

    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      if (existingUser.role === 'admin') {
        console.log(`\nℹ️ User with email "${email}" is already an admin.`);
      } else {
        existingUser.role = 'admin';
        existingUser.isApproved = true;
        await existingUser.save();
        console.log(`\n✓ Updated existing user "${email}" to admin role successfully.`);
      }
    } else {
      await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role: 'admin',
        isVerified: true,
        emailVerified: true,
        isApproved: true,
        isBlocked: false
      });
      console.log(`\n✓ Successfully created new admin user "${email}".`);
    }
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
