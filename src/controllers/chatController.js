import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

//GET Retrieve all chats where the authenticated user is involved.
export const getChats = async (req, res) => {
    try {
      const userId = req.user.id;
      const chats = await prisma.chat.findMany({
        where: {
          OR: [
            { clientId: userId },
            { freelancerId: userId }
          ]
        },
        orderBy: { updatedAt: 'desc' },
        include: {
          client: { select: { id: true, firstName: true, lastName: true } },
          freelancer: { select: { id: true, firstName: true, lastName: true } }
        }
      });
      res.json(chats);
    } catch (error) {
      console.error('Error retrieving chats:', error);
      res.status(500).json({ message: 'Server error while retrieving chats.' });
    }
};

 // POST /Create a new chat if one doesn't exist
 // If a chat already exists, return the existing chat
export const createChat = async (req, res) => {
  try {
    const userId = req.user.id;
    let chat;

    if (req.user.role === 'client') {
      const { freelancer_id } = req.body;

      if (!freelancer_id) {
        return res.status(400).json({ message: 'freelancer_id is required.' });
      }

      chat = await prisma.chat.findFirst({
        where: {
          clientId: userId,
          freelancerId: freelancer_id
        }
      });

      if (chat) return res.json(chat);

      chat = await prisma.chat.create({
        data: {
          clientId: userId,
          freelancerId: freelancer_id
        }
      });

    } else if (req.user.role === 'freelancer') {
      const { client_id } = req.body;

      if (!client_id) {
        return res.status(400).json({ message: 'client_id is required.' });
      }

      chat = await prisma.chat.findFirst({
        where: {
          clientId: client_id,
          freelancerId: userId
        }
      });

      if (chat) return res.json(chat);

      chat = await prisma.chat.create({
        data: {
          clientId: client_id,
          freelancerId: userId
        }
      });

    } else {
      return res.status(400).json({ message: 'Invalid user role.' });
    }

    return res.status(201).json(chat);

  } catch (error) {
    console.error('Error creating chat:', error);
    return res.status(500).json({ message: 'Server error while creating chat.' });
  }
};

//GET Retrieve all messages for a given chat.
export const getMessages = async (req, res) => {
  try {
    const chatId = parseInt(req.params.chatId);

    const chat = await prisma.chat.findUnique({ where: { id: chatId } });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found.' });
    }

    if (req.user.id !== chat.clientId && req.user.id !== chat.freelancerId) {
      return res.status(403).json({ message: 'Access denied to this chat.' });
    }

    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' }
    });

    return res.json(messages);

  } catch (error) {
    console.error('Error retrieving messages:', error);
    return res.status(500).json({ message: 'Server error while retrieving messages.' });
  }
};

// POST Send a new message in a chat
// After saving, broadcast the new message via Socket.IO to the client in the chat
export const sendMessage = async (req, res) => {
  try {
    const chatId = parseInt(req.params.chatId);
    const { message } = req.body;

    const chat = await prisma.chat.findUnique({ where: { id: chatId } });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found.' });
    }

    if (req.user.id !== chat.clientId && req.user.id !== chat.freelancerId) {
      return res.status(403).json({ message: 'Access denied to this chat.' });
    }

    const newMessage = await prisma.message.create({
      data: {
        chatId,
        senderId: req.user.id,
        message
      }
    });

    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() }
    });

    if (global.io) {
      global.io.to(String(chatId)).emit('newMessage', newMessage);
    }

    return res.status(201).json(newMessage);

  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ message: 'Server error while sending message.' });
  }
};

// Mark all messages in a chat as read.
export const markMessagesAsRead = async (req, res) => {
    try {
      const chatId = parseInt(req.params.chatId);
      const userId = req.user.id;
  
      // Only update messages that are not sent by the current user
      // as they don't need to be marked "read" by their sender.
      const updated = await prisma.message.updateMany({
        where: {
          chatId,
          senderId: { not: userId },
          isRead: false
        },
        data: { isRead: true }
      });
      
      res.json({ message: "Messages marked as read.", updatedCount: updated.count });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error." });
    }
  };
  

const chatController = {
  getChats,
  createChat,
  getMessages,
  sendMessage,
  markMessagesAsRead
};

export default chatController;