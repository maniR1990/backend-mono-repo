import type { preHandlerHookHandler, FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/auth.controller';

type AuthedInstance = FastifyInstance & { authenticate: preHandlerHookHandler };

export default async function authRoutes(app: AuthedInstance) {
  //public routes (no hook)
  app.post('/signup', AuthController.signUp);
  app.post('/login', AuthController.login);

  // protected group
  app.register((r: AuthedInstance) => {
    r.addHook('onRequest', r.authenticate); // or 'preHandler'
    r.get('/me', AuthController.me);
  });
}
