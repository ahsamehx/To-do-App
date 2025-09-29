import express from 'express';
import TaskRouter from './TaskRoutes.js';

const router = express.Router();

router.use('/Tasks', TaskRouter);

export default router;