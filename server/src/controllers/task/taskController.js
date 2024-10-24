import asyncHandler from "express-async-handler";
import TaskModel from "../../models/task/taskModel.js";

export const createTask = asyncHandler(async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Title is required",
      });
    }

    if (!description || description.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Description is required",
      });
    }

    const task = new TaskModel({
      title,
      description,
      dueDate,
      priority,
      status,
      user: req.user._id,
    });

    await task.save();

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

export const getTasks = asyncHandler(async (req, res) => {
  try {
    const tasks = await TaskModel.find({ user: req.user._id });

    if (!req.user._id) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized access",
      });
    }

    res.status(200).json({
      success: true,
      length: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

export const getTaskById = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { taskId } = req.params;

    if (!taskId) {
      return res.status(400).json({
        success: false,
        error: "Please provide a task id",
      });
    }

    const task = await TaskModel.findById(taskId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized access",
      });
    }

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    if (!task.user.equals(userId)) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized access to view this task",
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

export const updateTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { taskId } = req.params;

    if (!taskId) {
      return res.status(400).json({
        success: false,
        error: "Please provide a task id",
      });
    }

    const task = await TaskModel.findById(taskId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized access",
      });
    }

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    if (!task.user.equals(userId)) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized access to update this task",
      });
    }

    const { title, description, dueDate, priority, status } = req.body;

    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;
    task.status = status || task.status;

    await task.save();

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

export const deleteTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { taskId } = req.params;

    if (!taskId) {
      return res.status(400).json({
        success: false,
        error: "Please provide a task id",
      });
    }

    const task = await TaskModel.findById(taskId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized access",
      });
    }

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    if (!task.user.equals(userId)) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized access to delete this task",
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});
