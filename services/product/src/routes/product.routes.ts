import type { FastifyInstance } from 'fastify';
import { ProductController } from '../controller/product.controller';

export default async function productRoutes(app: FastifyInstance) {
  app.get('/v1/products', ProductController.list);
}
