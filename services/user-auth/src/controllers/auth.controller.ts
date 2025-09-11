import { FastifyReply, FastifyRequest } from 'fastify';
import * as AuthService from '../services/auth.service';
import { login, SignupBody, userPublic } from 'src/dto/auth.dto';

const JWT_SECRET = process.env.JWT_SECRET || 'DEV_SECRET';

export const AuthController = {
  signUp: async (req: FastifyRequest, reply: FastifyReply) => {
    const body = SignupBody.parse(req.body);
    const user = await AuthService.signUp({
      email: body.email,
      password: body.password,
      profile: body.profile,
    });
    const response = userPublic.parse(user);
    return reply.code(201).send(response);
  },
  login: async (req: FastifyRequest, reply: FastifyReply) => {
    const body = login.parse(req.body);
    const { payload, user, expires_in } = await AuthService.verifyLogin(body);

    const token = await reply.jwtSign(payload, { expiresIn: expires_in });
    const result = { token, user };
    return reply.code(201).send(result);
  },
  me: async (req: FastifyRequest, reply: FastifyReply) => {
    return reply.code(200).send('testing jwt... ');
  },
};
