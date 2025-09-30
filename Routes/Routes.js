import express from 'express';
import TaskRouter from './TaskRoutes.js';
import UserRouter from './UserRoutes.js';

const router = express.Router();

router.use('/Tasks', TaskRouter);
router.use('/User', UserRouter);


export default router;