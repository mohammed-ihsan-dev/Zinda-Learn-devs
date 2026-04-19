import User from '../models/User.js';


export const seedUsers = async () => {
  await User.deleteMany();
  console.log('Seed: Cleared existing users');

  
  
  const admin = await User.create({
    name: 'Admin',
    email: 'admin@zindalearn.com',
    password: 'admin123',
    role: 'admin',
    isApproved: true
  });
  console.log('Seed: Created Admin');

  const instructor = await User.create({
    name: 'Ihsan Mohammed',
    email: 'mohammed@zindalearn.com',
    password: 'instructor123',
    role: 'instructor',
    isApproved: true,
    bio: 'Expert React and Full-Stack Developer with 10+ years of experience.'
  });
  console.log('Seed: Created Instructor');

  const student = await User.create({
    name: 'Mhd Ihsan',
    email: 'mhdihsan@gmail.com.com',
    password: 'student123',
    role: 'student',
    isApproved: true
  });
  console.log('Seed: Created Student');

  return { admin, instructor, student };
};
