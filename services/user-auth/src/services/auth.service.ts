import { login, SignupBodyV1 } from 'src/dto/auth.dto';
import * as userDAO from '../dao/user.dao';
import { AUTH_CONSTANT } from './serviceConstants';
import bcrypt from 'bcryptjs';

type JWT_PAYLOAD = {
  sub: string;
  email: string;
};

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export async function signUp(input: SignupBodyV1) {
  try {
    const user = await userDAO.createUserWithProfile(input);
    if (!user) throw new Error(AUTH_CONSTANT.SIGN_UP.FAILED);
    if (user) return user;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

type MaybeUser = Awaited<ReturnType<typeof userDAO.getUserByEmail>>;
type PublicUser = Omit<NonNullable<MaybeUser>, 'passwordHash'>;

export type LoginResult = {
  payload: JWT_PAYLOAD;
  user: PublicUser;
  expires_in: string; // <- camelCase, the one jsonwebtoken/@fastify/jwt expects
};

export async function verifyLogin(input: login): Promise<LoginResult> {
  const user = await userDAO.getUserByEmail(input.email);

  if (!user) {
    throw new Error(AUTH_CONSTANT.LOG_IN.NO_USER);
  }

  const isValid = await bcrypt.compare(input.password, user.passwordHash);

  if (!isValid) {
    throw new Error(AUTH_CONSTANT.LOG_IN.INVALID_CREDENTIALS);
  }

  // If the code reaches this point, the user and password are valid
  const payload: JWT_PAYLOAD = { sub: user.id, email: user.email };
  const { passwordHash, ...userProfileDetails } = user;

  return { payload, user: userProfileDetails, expires_in: JWT_EXPIRES_IN };
}
