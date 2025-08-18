import type { FastifyInstance, preHandlerHookHandler } from 'fastify';
import { CartController } from '../controller/cart.controller';
import { AddToCartBody, SetQuantityBody } from '../validators/cart.dto';

type Authed = FastifyInstance & { authenticate: preHandlerHookHandler };

export default async function cartRoutes(app: Authed) {
  app.get('/v1/cart', { preHandler: app.authenticate }, CartController.getMine);

  app.post(
    '/v1/cart/items',
    {
      preHandler: app.authenticate,
      schema: { body: AddToCartBody },
    },
    CartController.add,
  );

  app.patch(
    '/v1/cart/items/:itemId',
    {
      preHandler: app.authenticate,
      schema: { body: SetQuantityBody },
    },
    CartController.setQuantity,
  );

  app.delete(
    '/v1/cart/items/:itemId',
    {
      preHandler: app.authenticate,
    },
    CartController.remove,
  );
}
