import '@fastify/jwt';
import 'fastify';

// Tell @fastify/jwt what your token looks like
declare module '@fastify/jwt' {
  interface FastifyJWT {
    // payload is what you sign/verify
    payload: {
      sub: string;
      email?: string;
      userId?: string; // keep both to be flexible with existing tokens
      role?: string;
      iat?: number;
      exp?: number;
    };
    // user is what you get on req.user after jwtVerify()
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

// Optionally, add any server decorators you use (so routes can see them)
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: import('fastify').preHandlerHookHandler;
    publishCartUpdate(userId: string, payload: unknown): Promise<void>;
  }
}
