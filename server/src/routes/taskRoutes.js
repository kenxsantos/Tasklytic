import express from "express";
import {
  createTask,
  getTaskById,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/task/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/task/create", protect, createTask);
router.get("/tasks", protect, getTasks);
router.get("/task/:taskId", protect, getTaskById);
router.patch("/task/:taskId", protect, updateTask);
router.delete("/task/:taskId", protect, deleteTask);

export default router;
