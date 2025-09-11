// services/product/src/app.ts
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import productRoutes from './routes/product.routes';
import cartRoutes from './routes/cart.routes';
import authJwtPlugin from '@mani-r16-devkit/auth-mw';
import cartWsPlugin from './websockets/index';
import { toHttpError } from './errors';

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
    const { status, body } = toHttpError(err);
    reply.code(status).send(body);
  });

  return app;
}
