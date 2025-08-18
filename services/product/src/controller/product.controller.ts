import type { FastifyRequest, FastifyReply } from 'fastify';
import { productService } from '../services/product.service';

export const ProductController = {
  list: async (req: FastifyRequest, reply: FastifyReply) => {
    const page = Number((req.query as any)?.page ?? 1);
    const pageSize = Number((req.query as any)?.pageSize ?? 20);
    const data = await productService.list(page, pageSize);
    return reply.send(data);
  },
};
