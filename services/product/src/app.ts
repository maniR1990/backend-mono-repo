// services/product/src/app.ts
import Fastify from 'fastify';

export function buildApp() {
  const app = Fastify({ logger: true });

  // 1) Health endpoint
  app.get('/health', async () => {
    return { uptime: process.uptime() };
  });

  // 2) Your product routes…
  //    e.g. app.register(productRoutes, { prefix: '/v1/product' });

  // 3) Global error handler
  app.setErrorHandler((err, _req, reply) => {
    app.log.error(err);
    reply
      .status(err.statusCode ?? 500)
      .type('application/json')
      .send({ status: 'error', message: 'Internal Server Error' });
  });

  return app;
}
