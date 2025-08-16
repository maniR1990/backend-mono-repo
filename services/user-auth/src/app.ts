// services/user-auth/src/app.ts
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import authJwt from './middlewares/auth-jwt';
import authRoutes from './routes/auth.routes';

export function buildApp() {
  const app = Fastify({ logger: true });
  app.register(cors, { origin: true, credentials: true });
  app.register(helmet, { contentSecurityPolicy: false });

  // register JWT
  app.register(authJwt);

  // 1) Health endpoint
  app.get('/health', async () => {
    return { uptime: process.uptime() };
  });

  // 2) Your real API routes go here…
  //    e.g. app.register(authRoutes, { prefix: '/v1/auth' });

  app.register(authRoutes, { prefix: '/v1' });

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
