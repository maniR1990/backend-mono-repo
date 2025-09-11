import fastifyJwt from '@fastify/jwt';
import fp from 'fastify-plugin';
import { FastifyReply } from 'fastify/types/reply';
import { FastifyRequest } from 'fastify/types/request';
import { DomainError } from '../errors';

export default fp(async (app) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    app.log.error('JWT_SECRET is missing or empty');
    throw new Error('JWT_SECRET is not set');
  }
  // Guard: only register once per scope
  if (!app.hasDecorator('jwt')) {
    app.register(fastifyJwt, { secret });
  }

  app.decorate('authenticate', async (req: FastifyRequest, _reply: FastifyReply) => {
    try {
      await req.jwtVerify();
    } catch (e) {
      throw new DomainError('UNAUTHORIZED', 'Unauthorized', 401);
    }
  });
});
