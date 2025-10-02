import mongoose from "mongoose";
const Schema = mongoose.Schema;
const TaskSchema = new Schema({
    title: String,
    isCompleted: Boolean, 
    createdAt: { type: Date, default: Date.now },
    userId : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Task = mongoose.model("Task", TaskSchema);
export default Task;