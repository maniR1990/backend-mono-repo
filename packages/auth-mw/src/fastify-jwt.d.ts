import '@fastify/jwt';
import 'fastify';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      sub: string;
      email?: string;
      userId?: string;
      role?: string;
      iat?: number;
      exp?: number;
    };
    user: {
      sub: string;
      email?: string;
      userId?: string;
      role?: string;
      iat?: number;
      exp?: number;
    };
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: import('fastify').preHandlerHookHandler;
  }
}
