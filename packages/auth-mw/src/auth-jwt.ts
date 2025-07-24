import fastifyJwt from '@fastify/jwt';
import fp from 'fastify-plugin';

export type signIn = {
  accessExpiresIn?: string;
};
export interface AuthJwtOptions {
  secret: string;
  sign: signIn;
}

export const authJwt = (opts: AuthJwtOptions) => {
  fp(async (app) => {
    app.register(fastifyJwt, {
      secret: opts?.secret,
      sign: {
        expiresIn: opts?.sign?.accessExpiresIn ?? '15m',
      },
    });

    app.decorate('authenticate', async (req: any, reply: any) => {
      try {
        await req.jwtVerify();
      } catch {
        reply.code(401).send({ status: 'error', error: 'UNAUTHENTICATED' });
      }
    });
  });
};

export { fastifyJwt };
