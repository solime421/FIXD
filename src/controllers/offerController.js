import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Freelancer Sends an Offer
// Emits a 'newOffer' event via Socket.IO to the chat room when an offer is sent.

export const sendOffer = async (req, res) => {
  try {
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: 'Only freelancers can send offers.' });
    }

    const { chatId, offer_name } = req.body;

    const offer = await prisma.offer.create({
      data: {
        chatId: parseInt(chatId),
        freelancerId: req.user.id,
        offerName: offer_name,
      },
    });

    // Emit real-time notification to the chat room
    if (global.io) {
      global.io.to(String(chatId)).emit('newOffer', offer);
    }

    res.status(201).json(offer);
  } catch (error) {
    console.error('Error sending offer:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};


 //Client Views the Offer for a Chat
 //Retrieves the most recent, unaccepted (pending) offer for a specific chat.
 //When a client opens or refreshes the chat screen, the client calls the GET /api/offers/:chatId endpoint to fetch any pending offer that might have been sent before or if the socket event was missed.
export const getOfferByChat = async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can view offers.' });
    }

    const chatId = parseInt(req.params.chatId);

    const offer = await prisma.offer.findFirst({
      where: {
        chatId,
        accepted: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!offer) {
      return res.status(404).json({ message: 'No pending offer found for this chat.' });
    }

    res.json(offer);
  } catch (error) {
    console.error('Error retrieving offer:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};


// Client Accepts the Offer
export const acceptOffer = async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can accept offers.' });
    }

    const offerId = parseInt(req.params.id);

    const updatedOffer = await prisma.offer.update({
      where: { id: offerId },
      data: {
        accepted: true,
        acceptedAt: new Date(),
      },
    });

    // create an order immediately
    const order = await prisma.order.create({
      data: {
        clientId: req.user.id,
        freelancerId: updatedOffer.freelancerId,
        offerName: updatedOffer.offerName,
        status: false, // false = "in progress"
      },
    });

    res.json({
      message: 'Offer accepted and order created.',
      order,
    });
  } catch (error) {
    console.error('Error accepting offer:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

const offerController = {
  sendOffer,
  getOfferByChat,
  acceptOffer,
};

export default offerController;