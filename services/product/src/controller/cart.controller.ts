import type { FastifyRequest, FastifyReply } from 'fastify';
import { cartService } from '../services/cart.service';

export const CartController = {
  getMine: async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = (req.user as any).sub || (req.user as any).userId;
    const data = await cartService.getMyCart(userId);
    return reply.send(data);
  },

  add: async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = (req.user as any).sub || (req.user as any).userId;
    const { productId, quantity = 1 } = req.body as any;
    const data = await cartService.addToCart(userId, productId, quantity);

    // push WS update
    await (req.server as any).publishCartUpdate(userId, data.cart);
    return reply.code(201).send(data);
  },

  setQuantity: async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = (req.user as any).sub || (req.user as any).userId;
    const { itemId } = req.params as any;
    const { quantity } = req.body as any;
    const data = await cartService.setQuantity(userId, itemId, quantity);

    await (req.server as any).publishCartUpdate(userId, data.cart);
    return reply.send(data);
  },

  remove: async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = (req.user as any).sub || (req.user as any).userId;
    const { itemId } = req.params as any;
    const data = await cartService.removeItem(userId, itemId);

    await (req.server as any).publishCartUpdate(userId, data.cart);
    return reply.send(data);
  },
};
