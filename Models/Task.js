import mongoose from "mongoose";
const Schema = mongoose.Schema;
const TaskSchema = new Schema({
    title: String,
    isCompleted: Boolean, 
    createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model("Task", TaskSchema);
export default Task;