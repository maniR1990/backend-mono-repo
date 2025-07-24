import { buildApp } from './app';
import { env } from './config';

(async () => {
  const app = buildApp();
  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
  } catch (e) {}
})();
