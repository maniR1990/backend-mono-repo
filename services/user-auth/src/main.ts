import { buildApp } from './app';
import { env } from './config';

(async () => {
  const app = buildApp();
  try {
    app.ready().then(() => app.printRoutes());
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    app.log.info(`Auth service listening on ${env.PORT}`);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
