import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET ?? 'change-this-secret';
const expiresIn = process.env.JWT_EXPIRES_IN ?? '3600s';

export interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
}

export function signJwt(payload: JwtPayload) {
  return jwt.sign(payload, secret, { expiresIn } as any);
}

export function verifyJwt(token: string) {
  return jwt.verify(token, secret) as JwtPayload;
}
