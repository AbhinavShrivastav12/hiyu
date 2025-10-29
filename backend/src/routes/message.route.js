import express from 'express';
import { getMessages, getUsersForSideBar, sendMessages } from '../controllers/message.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

//for showing user
router.get('/users', protectedRoute, getUsersForSideBar);

//getting message by user id
router.get('/:id', protectedRoute, getMessages);

//sending message
router.post('/send/:id', protectedRoute, sendMessages);


export default router;