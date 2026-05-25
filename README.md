# Zinda Learn - LMS Platform

Zinda Learn is a full-stack Learning Management System built on the MERN stack (MongoDB, Express, React, Node.js). This platform provides role-based access for Students, Instructors, and Admins to manage courses, enrollments, payments, and live interactive classes.

## Features
- **Multi-Role Dashboards**: Specific views and permissions for Students, Instructors, and Administrators.
- **Live Classes**: Integrated with WebRTC and Socket.io for real-time video sessions.
- **Payment Gateway**: Seamless course purchasing via Razorpay.
- **Video & Asset Uploads**: Backed by Cloudinary for robust media delivery.
- **Real-time Notifications**: Triggered on course enrollment, class start times, and system events.

## Project Structure
This repository uses an industry-standard production folder layout:

```text
zinda-learn/
├── client/       # React (Vite) frontend application
├── server/       # Node.js Express backend API
├── docs/         # Setup and deployment documentation
```

## Getting Started

See the documentation in the `/docs` folder:
- [Local Setup Guide](docs/setup.md)
- [Production Deployment Guide](docs/deployment.md)
