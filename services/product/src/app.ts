// services/product/src/app.ts
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import productRoutes from './routes/product.routes';
import cartRoutes from './routes/cart.routes';
import authJwtPlugin from '@mani-r16-devkit/auth-mw';
import cartWsPlugin from './websockets/index';

export function buildApp() {
  const app = Fastify({ logger: true });
  app.register(cors, { origin: true, credentials: true });
  app.register(helmet, { global: true });
  app.register(authJwtPlugin);
  app.register(cartWsPlugin);
  app.register(productRoutes);
  app.register(cartRoutes);

  // 1) Health endpoint
  app.get('/health', async () => {
    return { uptime: process.uptime() };
  });

  // 2) Your product routes…
  //    e.g. app.register(productRoutes, { prefix: '/v1/product' });

  // 3) Global error handler
  app.setErrorHandler((err, req, reply) => {
    req.log.error(err);
    const map: Record<string, number> = {
      PRODUCT_NOT_FOUND: 404,
      OUT_OF_STOCK: 400,
      ITEM_NOT_FOUND: 404,
      FORBIDDEN: 403,
    };
    const status = map[err.message] ?? 500;
    reply.code(status).send({ success: false, error: err.message });
  });

  return app;
}
