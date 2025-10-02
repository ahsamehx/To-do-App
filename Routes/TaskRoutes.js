import express from "express";
import Task from "../Models/Task.js";
import authMiddleware from "../Middlewares/authMiddleware.js";
const router = express.Router();

// Create a new task
router.post('/AddTasks', authMiddleware, async (req, res) => {
    const newTask = new Task({
        title: req.body.title,
        isCompleted: false,
        userId: req.userId
    });
    try {
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all tasks
router.get('/GetTasks', authMiddleware ,async (req, res) => {
    try {
        const tasks = await Task.find({userId:req.userId});
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a task
router.put('/UpdateTask/:id', authMiddleware,  async (req, res) => {
    try {
        const updatedTask = await Task.findOneAndUpdate({_id : req.params.id, userId : req.userId}, req.body, { new: true });
        if(!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}); 

// Delete a task
router.delete('/DeleteTask/:id', authMiddleware, async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({_id : req.params.id, userId : req.userId});
        if(!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;

