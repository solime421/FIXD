import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


// Create a new order. MAYBE DON'T NEED
export const createOrder = async (req, res) => {
  try {
    const { freelancerId, offerName } = req.body;

    const order = await prisma.order.create({
      data: {
        clientId: req.user.id,
        freelancerId: parseInt(freelancerId),
        offerName,
        status: false, // false = "in progress"
      },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};


export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { clientId: userId },
          { freelancerId: userId },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        client:     { select: { firstName: true, lastName: true } },
        freelancer: { select: { firstName: true, lastName: true } },
      },
    });

    res.json(orders);
  } catch (error) {
    console.error('Error retrieving orders:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};


//Update order status (usually by freelancer).
export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId);
    const { status } = req.body; // true = finished, false = in progress

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    if (req.user.role !== 'freelancer' || req.user.id !== order.freelancerId) {
      return res.status(403).json({ message: 'Only the assigned freelancer can update the order status.' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

const orderController = {
  createOrder,
  getOrders,
  updateOrderStatus,
};

export default orderController;