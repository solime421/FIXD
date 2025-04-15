import express from 'express';
import chatController from '../controllers/chatController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET - Retrieve all chats for the authenticated user
router.get('/', verifyToken, chatController.getChats);

// POST - Create a new chat or return an existing one
router.post('/', verifyToken, chatController.createChat);

// GET - Retrieve all messages for a specific chat
router.get('/:chatId/messages', verifyToken, chatController.getMessages);

// POST - Send a new message in a specific chat and broadcast it
router.post('/:chatId/messages', verifyToken, chatController.sendMessage);

// Update messages as read
router.post('/:chatId/messages/read', verifyToken, chatController.markMessagesAsRead);


export default router;