// ═══════════════════════════════════════════════════════════════
// Zinda Learn — Production Database Seeder
// ═══════════════════════════════════════════════════════════════
// Usage:  npm run seed   (or)   node scripts/seed.js
//
// Safe to run multiple times — uses existence checks, never
// deletes data, never duplicates records.
//
// Creates:
//   1. SystemSettings  (singleton)
//   2. Admin user      (admin@zindalearn.com)
//   3. Two instructors (approved, verified)
//   4. Three published courses with modules + lessons
// ═══════════════════════════════════════════════════════════════

import '../config/env.js';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Course from '../models/Course.js';
import SystemSettings from '../models/SystemSettings.js';

// ─── Helpers ───────────────────────────────────────────────────

const log = (icon, msg) => console.log(`${icon} ${msg}`);

// ─── 1. System Settings ───────────────────────────────────────

async function seedSystemSettings() {
  const existing = await SystemSettings.findOne();
  if (existing) {
    log('✓', 'SystemSettings already exists — skipped');
    return existing;
  }

  const settings = await SystemSettings.create({
    maintenanceMode: false,
    allowStudentRegistration: true,
    allowInstructorApplications: true,
    enablePublicCourseBrowsing: true,
    requireEmailVerification: false,
    enableGoogleLogin: true,
    jwtSessionTimeout: 24,
    enableEmailService: true,
    adminAlertEmails: 'admin@zindalearn.com',
    platformVersion: '1.0.0'
  });

  log('✓', 'SystemSettings seeded');
  return settings;
}

// ─── 2. Admin User ────────────────────────────────────────────

async function seedAdmin() {
  const email = 'admin@zindalearn.com';
  const existing = await User.findOne({ email });
  if (existing) {
    log('✓', `Admin already exists (${email}) — skipped`);
    return existing;
  }

  // Password is hashed automatically by User.pre('save') hook
  const admin = await User.create({
    name: 'Zinda Learn Admin',
    email,
    password: 'admin123',
    role: 'admin',
    isVerified: true,
    emailVerified: true,
    isApproved: true,
    isBlocked: false,
    bio: 'Platform administrator for Zinda Learn.',
    phone: '+919000000001',
    language: 'English (US)',
    preferences: {
      darkMode: false,
      videoQuality: '1080p'
    }
  });

  log('✓', `Admin created — ${email}`);
  return admin;
}

// ─── 3. Instructor Users ─────────────────────────────────────

const instructorData = [
  {
    name: 'Arjun Mehta',
    email: 'arjun.mehta@zindalearn.com',
    password: 'instructor123',
    bio: 'Senior Full-Stack Engineer with 8+ years building scalable SaaS products using React, Node.js, and MongoDB. Former tech lead at a Y-Combinator startup. Passionate about teaching clean architecture and real-world development patterns.',
    phone: '+919876543210',
    socialLinks: {
      website: 'https://arjunmehta.dev',
      linkedin: 'https://linkedin.com/in/arjunmehta',
      twitter: 'https://twitter.com/arjunmehta_dev',
      github: 'https://github.com/arjunmehta'
    },
    paymentDetails: {
      bank: {
        accountNumber: '1234567890',
        ifscCode: 'SBIN0001234',
        bankName: 'State Bank of India',
        accountHolderName: 'Arjun Mehta'
      },
      upi: { upiId: 'arjun@okaxis' },
      preferredMethod: 'upi'
    }
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@zindalearn.com',
    password: 'instructor123',
    bio: 'Backend architect specializing in Node.js microservices, REST API design, and DevOps. 6 years of experience shipping production-grade APIs serving 500K+ daily users. Guest speaker at JSConf India and NodeConf EU.',
    phone: '+919876543211',
    socialLinks: {
      website: 'https://priyasharma.io',
      linkedin: 'https://linkedin.com/in/priyasharma',
      github: 'https://github.com/priyasharma'
    },
    paymentDetails: {
      bank: {
        accountNumber: '0987654321',
        ifscCode: 'HDFC0001234',
        bankName: 'HDFC Bank',
        accountHolderName: 'Priya Sharma'
      },
      upi: { upiId: 'priya@oksbi' },
      preferredMethod: 'bank'
    }
  }
];

async function seedInstructors() {
  const instructors = [];

  for (const data of instructorData) {
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      log('✓', `Instructor already exists (${data.email}) — skipped`);
      instructors.push(existing);
      continue;
    }

    // Password is hashed automatically by User.pre('save') hook
    const instructor = await User.create({
      ...data,
      role: 'instructor',
      isVerified: true,
      emailVerified: true,
      isApproved: true,
      isBlocked: false,
      language: 'English (US)',
      preferences: {
        darkMode: false,
        videoQuality: '1080p'
      }
    });

    log('✓', `Instructor created — ${data.email}`);
    instructors.push(instructor);
  }

  return instructors;
}

// ─── 4. Published Courses ────────────────────────────────────

function buildCourseData(instructors) {
  const [arjun, priya] = instructors;

  return [
    {
      title: 'MERN Stack Development — Build Production Apps',
      description: 'A comprehensive, project-driven course that takes you from zero to deploying full-stack web applications using MongoDB, Express.js, React, and Node.js. You will build a complete SaaS platform from scratch, covering authentication, payments, real-time features, and cloud deployment. Every concept is taught through hands-on coding — no slides, no fluff.',
      shortDescription: 'Master the MERN stack by building a real-world SaaS application from scratch.',
      price: 4999,
      discountPrice: 2999,
      currency: 'INR',
      instructor: arjun._id,
      category: 'development',
      level: 'Intermediate',
      language: 'English',
      tags: ['MERN', 'React', 'Node.js', 'MongoDB', 'Express', 'Full Stack', 'JavaScript'],
      requirements: [
        'Basic understanding of HTML, CSS, and JavaScript',
        'Familiarity with command line / terminal',
        'Node.js installed on your machine',
        'A code editor (VS Code recommended)'
      ],
      whatYouWillLearn: [
        'Build full-stack applications with React and Node.js',
        'Design and implement RESTful APIs with Express.js',
        'Work with MongoDB and Mongoose ODM',
        'Implement JWT authentication and role-based authorization',
        'Integrate Razorpay payment gateway',
        'Deploy applications to AWS EC2 with PM2 and Nginx',
        'Handle real-time features with Socket.IO'
      ],
      status: 'published',
      isPublished: true,
      isApproved: true,
      modules: [
        {
          title: 'Project Setup & Architecture',
          description: 'Setting up the development environment, project structure, and core tooling.',
          order: 0,
          lessons: [
            {
              title: 'Course Overview & What We Will Build',
              description: 'A walkthrough of the final application, tech stack overview, and learning roadmap.',
              isFree: true,
              order: 0,
              duration: 720,
              keyTakeaways: ['Understand the project scope', 'Preview the final deployed application']
            },
            {
              title: 'Setting Up the Backend with Express.js',
              description: 'Initialize Node.js project, install dependencies, configure Express middleware, environment variables.',
              order: 1,
              duration: 1200,
              keyTakeaways: ['Express app initialization', 'Middleware configuration', 'Environment management with dotenv']
            },
            {
              title: 'MongoDB Atlas & Mongoose Connection',
              description: 'Create a cloud MongoDB cluster, configure connection strings, design your first Mongoose schema.',
              order: 2,
              duration: 900,
              keyTakeaways: ['MongoDB Atlas setup', 'Mongoose connection pooling', 'Schema design principles']
            }
          ]
        },
        {
          title: 'Authentication & Authorization',
          description: 'Building a secure authentication system with JWT tokens and role-based access control.',
          order: 1,
          lessons: [
            {
              title: 'User Registration with Bcrypt Hashing',
              description: 'Build the registration endpoint, hash passwords with bcrypt, validate input data.',
              order: 0,
              duration: 1500,
              keyTakeaways: ['Password hashing best practices', 'Input validation', 'Mongoose pre-save hooks']
            },
            {
              title: 'JWT Login & Token Management',
              description: 'Generate and verify JWT tokens, implement login flow, manage token expiration.',
              order: 1,
              duration: 1380,
              keyTakeaways: ['JWT creation and verification', 'Secure token storage patterns', 'Token refresh strategy']
            },
            {
              title: 'Role-Based Access Control',
              description: 'Implement middleware for student, instructor, and admin role authorization.',
              order: 2,
              duration: 1020,
              keyTakeaways: ['Authorization middleware', 'Route protection patterns', 'Admin vs instructor permissions']
            }
          ]
        },
        {
          title: 'React Frontend — UI & State Management',
          description: 'Building the React frontend with modern patterns, routing, and global state.',
          order: 2,
          lessons: [
            {
              title: 'React Project Setup with Vite',
              description: 'Initialize a Vite + React project, configure routing with React Router v6, install UI libraries.',
              isFree: true,
              order: 0,
              duration: 840,
              keyTakeaways: ['Vite project scaffolding', 'React Router v6 configuration', 'Project structure best practices']
            },
            {
              title: 'Building Reusable UI Components',
              description: 'Create a design system with buttons, cards, modals, and layout components.',
              order: 1,
              duration: 1800,
              keyTakeaways: ['Component composition patterns', 'Prop-driven design', 'CSS modules vs styled components']
            },
            {
              title: 'API Integration & Axios Setup',
              description: 'Configure Axios interceptors, handle loading states, build custom hooks for data fetching.',
              order: 2,
              duration: 1200,
              keyTakeaways: ['Axios interceptors for auth', 'Custom hooks for API calls', 'Error boundary patterns']
            }
          ]
        },
        {
          title: 'Payments & Deployment',
          description: 'Integrating Razorpay payments and deploying to production on AWS.',
          order: 3,
          lessons: [
            {
              title: 'Razorpay Payment Integration',
              description: 'Create payment orders server-side, handle checkout on the frontend, verify payment signatures.',
              order: 0,
              duration: 1680,
              keyTakeaways: ['Razorpay order creation', 'Checkout flow implementation', 'Signature verification']
            },
            {
              title: 'Production Deployment to AWS EC2',
              description: 'Set up an EC2 instance, configure PM2 process manager, Nginx reverse proxy, and SSL with Certbot.',
              order: 1,
              duration: 2400,
              keyTakeaways: ['EC2 instance provisioning', 'PM2 cluster mode', 'Nginx configuration', 'Let\'s Encrypt SSL']
            }
          ]
        }
      ]
    },
    {
      title: 'React Frontend Mastery — From Basics to Advanced Patterns',
      description: 'Deep-dive into React.js — from component fundamentals to advanced patterns like custom hooks, context API, performance optimization, and production-ready project architecture. This course covers everything a frontend developer needs to build fast, maintainable, and scalable React applications that pass real-world code reviews.',
      shortDescription: 'Go from React beginner to confident frontend developer with real-world patterns.',
      price: 3499,
      discountPrice: 1999,
      currency: 'INR',
      instructor: arjun._id,
      category: 'development',
      level: 'Beginner',
      language: 'English',
      tags: ['React', 'JavaScript', 'Frontend', 'Hooks', 'Context API', 'Performance'],
      requirements: [
        'Basic HTML, CSS, and JavaScript knowledge',
        'A modern web browser (Chrome recommended)',
        'Node.js v18+ installed'
      ],
      whatYouWillLearn: [
        'Understand React component lifecycle and hooks deeply',
        'Build custom hooks for reusable logic',
        'Manage global state with Context API and useReducer',
        'Optimize rendering with React.memo, useMemo, and useCallback',
        'Implement client-side routing with React Router v6',
        'Write clean, testable component architecture',
        'Deploy React apps with Vite to production'
      ],
      status: 'published',
      isPublished: true,
      isApproved: true,
      modules: [
        {
          title: 'React Fundamentals',
          description: 'Core concepts — JSX, components, props, state, and event handling.',
          order: 0,
          lessons: [
            {
              title: 'Introduction to React & JSX',
              description: 'What is React, why use it, understanding JSX syntax and virtual DOM.',
              isFree: true,
              order: 0,
              duration: 900,
              keyTakeaways: ['React philosophy', 'JSX compilation', 'Virtual DOM reconciliation']
            },
            {
              title: 'Components, Props & Children',
              description: 'Functional components, passing data via props, composition with children.',
              order: 1,
              duration: 1200,
              keyTakeaways: ['Component hierarchy', 'Props drilling awareness', 'Children composition']
            },
            {
              title: 'State Management with useState',
              description: 'Managing local component state, controlled inputs, state update batching.',
              order: 2,
              duration: 1080,
              keyTakeaways: ['useState hook patterns', 'Immutable state updates', 'Functional updaters']
            }
          ]
        },
        {
          title: 'Advanced Hooks & Patterns',
          description: 'Deep dive into useEffect, custom hooks, and advanced component patterns.',
          order: 1,
          lessons: [
            {
              title: 'useEffect — Side Effects Done Right',
              description: 'Data fetching, subscriptions, cleanup functions, and dependency arrays.',
              order: 0,
              duration: 1500,
              keyTakeaways: ['Effect lifecycle', 'Cleanup patterns', 'Dependency array rules']
            },
            {
              title: 'Building Custom Hooks',
              description: 'Extract reusable logic into custom hooks — useLocalStorage, useFetch, useDebounce.',
              order: 1,
              duration: 1320,
              keyTakeaways: ['Hook extraction patterns', 'Composable logic', 'Testing custom hooks']
            },
            {
              title: 'Performance Optimization',
              description: 'React.memo, useMemo, useCallback, lazy loading, and profiling.',
              order: 2,
              duration: 1800,
              keyTakeaways: ['Preventing unnecessary re-renders', 'Memoization strategies', 'React DevTools profiler']
            }
          ]
        }
      ]
    },
    {
      title: 'Node.js Backend Engineering — APIs, Security & Scale',
      description: 'Master server-side JavaScript with Node.js and Express.js. This course covers RESTful API design, database modeling with MongoDB, authentication, file uploads, background jobs, rate limiting, caching, and deployment best practices. Built for developers who want to architect backends that handle production traffic reliably.',
      shortDescription: 'Build production-grade REST APIs with Node.js, Express, and MongoDB.',
      price: 3999,
      discountPrice: 2499,
      currency: 'INR',
      instructor: priya._id,
      category: 'development',
      level: 'Advanced',
      language: 'English',
      tags: ['Node.js', 'Express', 'MongoDB', 'REST API', 'Backend', 'Security', 'DevOps'],
      requirements: [
        'Solid JavaScript fundamentals (ES6+)',
        'Basic understanding of HTTP and REST',
        'Command line proficiency',
        'MongoDB basics helpful but not required'
      ],
      whatYouWillLearn: [
        'Design scalable RESTful APIs following industry best practices',
        'Model complex data relationships with Mongoose',
        'Implement secure authentication with JWT and bcrypt',
        'Handle file uploads with Multer and Cloudinary',
        'Add rate limiting, compression, and security headers',
        'Build background job processing',
        'Cache frequently accessed data with Redis',
        'Deploy and monitor Node.js apps with PM2'
      ],
      status: 'published',
      isPublished: true,
      isApproved: true,
      modules: [
        {
          title: 'Node.js & Express Foundations',
          description: 'Core server concepts, middleware chain, and project architecture.',
          order: 0,
          lessons: [
            {
              title: 'Node.js Runtime Deep Dive',
              description: 'Event loop, non-blocking I/O, module system, and process management.',
              isFree: true,
              order: 0,
              duration: 1080,
              keyTakeaways: ['Event loop phases', 'Module resolution', 'Process lifecycle']
            },
            {
              title: 'Express.js Middleware Architecture',
              description: 'Request-response cycle, middleware ordering, error handling middleware, custom middleware patterns.',
              order: 1,
              duration: 1440,
              keyTakeaways: ['Middleware chain execution', 'Error boundaries', 'Custom middleware design']
            },
            {
              title: 'Project Structure & Clean Architecture',
              description: 'Routes, controllers, services, models — organizing code for maintainability at scale.',
              order: 2,
              duration: 1200,
              keyTakeaways: ['Separation of concerns', 'Service layer pattern', 'Dependency injection basics']
            }
          ]
        },
        {
          title: 'Database Design & Mongoose',
          description: 'MongoDB schema design, relationships, indexing, and query optimization.',
          order: 1,
          lessons: [
            {
              title: 'Schema Design Patterns',
              description: 'Embedding vs referencing, one-to-many patterns, denormalization trade-offs.',
              order: 0,
              duration: 1320,
              keyTakeaways: ['When to embed vs reference', 'Schema versioning', 'Migration strategies']
            },
            {
              title: 'Indexing & Query Performance',
              description: 'Compound indexes, text search, explain plans, and Atlas performance advisor.',
              order: 1,
              duration: 1500,
              keyTakeaways: ['Index types and strategies', 'Query explain analysis', 'Performance monitoring']
            }
          ]
        },
        {
          title: 'Security & Production Hardening',
          description: 'Securing APIs against common attack vectors and production-readiness.',
          order: 2,
          lessons: [
            {
              title: 'API Security Best Practices',
              description: 'Helmet, CORS, rate limiting, input sanitization, and OWASP top 10 mitigation.',
              order: 0,
              duration: 1680,
              keyTakeaways: ['Security headers with Helmet', 'Rate limiting strategies', 'Input sanitization']
            },
            {
              title: 'Caching with Redis',
              description: 'Setting up Redis, cache invalidation patterns, session storage.',
              order: 1,
              duration: 1200,
              keyTakeaways: ['Redis data structures', 'Cache-aside pattern', 'TTL strategies']
            },
            {
              title: 'Production Deployment & Monitoring',
              description: 'PM2 process management, Nginx configuration, health checks, and logging.',
              order: 2,
              duration: 1800,
              keyTakeaways: ['PM2 ecosystem config', 'Nginx reverse proxy', 'Structured logging']
            }
          ]
        }
      ]
    }
  ];
}

async function seedCourses(instructors) {
  const coursesData = buildCourseData(instructors);
  const created = [];

  for (const courseData of coursesData) {
    const existing = await Course.findOne({
      title: courseData.title,
      instructor: courseData.instructor
    });

    if (existing) {
      log('✓', `Course already exists — "${courseData.title}" — skipped`);
      created.push(existing);
      continue;
    }

    const course = await Course.create(courseData);
    log('✓', `Course created — "${courseData.title}"`);
    created.push(course);
  }

  return created;
}

// ─── Main Orchestrator ───────────────────────────────────────

async function main() {
  console.log('\n══════════════════════════════════════════════');
  console.log('  Zinda Learn — Database Seeder');
  console.log('══════════════════════════════════════════════\n');

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000
    });
    log('✓', `Connected to MongoDB — ${mongoose.connection.host}`);
    console.log('');

    // 1. System Settings
    console.log('─── System Settings ───');
    await seedSystemSettings();
    console.log('');

    // 2. Admin
    console.log('─── Admin User ───');
    const admin = await seedAdmin();
    console.log('');

    // 3. Instructors
    console.log('─── Instructor Users ───');
    const instructors = await seedInstructors();
    console.log('');

    // 4. Courses
    console.log('─── Published Courses ───');
    const courses = await seedCourses(instructors);
    console.log('');

    // Summary
    console.log('══════════════════════════════════════════════');
    console.log('  Seeding Summary');
    console.log('══════════════════════════════════════════════');
    console.log(`  SystemSettings : 1 document`);
    console.log(`  Admin          : ${admin.email}`);
    console.log(`  Instructors    : ${instructors.length} users`);
    console.log(`  Courses        : ${courses.length} published`);
    console.log('══════════════════════════════════════════════\n');

    log('✓', 'Seeding completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Seeding failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
