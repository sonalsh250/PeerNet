import express from 'express';
import { 
    getChats, 
    createChat, 
    getMessages, 
    sendMessage 
} from '../controllers/chat.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protectRoute, getChats);
router.post('/', protectRoute, createChat);
router.get('/:chatId/messages', protectRoute, getMessages);
router.post('/message', protectRoute, sendMessage);

export default router;