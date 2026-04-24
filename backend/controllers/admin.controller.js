import { adminService } from "../services/admin.service.js";
import mongoose from "mongoose";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getPendingInstructors = async (req, res) => {
  try {
    const instructors = await adminService.getPendingInstructors();
    res.status(200).json({ success: true, data: instructors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const approveInstructor = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid ID" });
    const instructor = await adminService.approveInstructor(req.params.id);
    if (!instructor) return res.status(404).json({ success: false, message: "Instructor not found" });
    res.status(200).json({ success: true, message: "Instructor approved", data: instructor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const rejectInstructor = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid ID" });
    await adminService.rejectInstructor(req.params.id);
    res.status(200).json({ success: true, message: "Instructor rejected/removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { users, total } = await adminService.getAllUsers(req.query);
    res.status(200).json({ success: true, total, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const blockUser = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid ID" });
    const user = await adminService.blockUser(req.params.id);
    res.status(200).json({ success: true, message: "User blocked", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const unblockUser = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid ID" });
    const user = await adminService.unblockUser(req.params.id);
    res.status(200).json({ success: true, message: "User unblocked", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const { courses, total } = await adminService.getAllCourses(req.query);
    res.status(200).json({ success: true, total, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid ID" });
    await adminService.deleteCourse(req.params.id);
    res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const togglePublishStatus = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid ID" });
    const course = await adminService.togglePublishStatus(req.params.id);
    res.status(200).json({ success: true, message: "Course status toggled", data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPendingCourses = async (req, res) => {
  try {
    const courses = await adminService.getPendingCourses();
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const approveCourse = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid ID" });
    const course = await adminService.approveCourse(req.params.id);
    res.status(200).json({ success: true, message: "Course approved", data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const rejectCourse = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid ID" });
    const course = await adminService.rejectCourse(req.params.id);
    res.status(200).json({ success: true, message: "Course rejected", data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
