import User from "../models/User.js";
import admin from "../config/firebaseAdmin.js";

// Register user
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "student"
    });

    const token = user.generateToken();

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        profilePic: user.profilePic
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password"
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    if (user.role === "instructor" && !user.isApproved) {
      return res.status(403).json({
        success: false,
        message: "Instructor account is pending approval"
      });
    }

    const token = user.generateToken();

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        profilePic: user.profilePic
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get current user
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("enrolledCourses");

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, phone, avatar, socialLinks } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, bio, phone, avatar, socialLinks },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    user.password = newPassword;
    await user.save();

    const token = user.generateToken();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Google Login
export const googleLogin = async (req, res) => {
  try {
    const { name, email, photo, token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Firebase token is required"
      });
    }

    // 1. Verify Firebase token
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired Firebase token"
      });
    }

    if (!decodedToken) {
      return res.status(401).json({
        success: false,
        message: "Could not verify Firebase token"
      });
    }

    // 2. Check user in database
    let user = await User.findOne({ email });

    if (!user) {
      // 3. Create new user if not exists
      const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
      
      user = await User.create({
        name,
        email,
        profilePic: photo || "",
        avatar: photo || "",
        role: "student",
        password: randomPassword
      });
    }

    // 4. Generate JWT for our app
    const jwtToken = user.generateToken();

    res.status(200).json({
      success: true,
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        profilePic: user.profilePic
      }
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during Google login"
    });
  }
};
