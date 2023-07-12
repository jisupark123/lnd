import { sign } from 'jsonwebtoken';
import { JwtExpiresInType } from '../domain/jwt';

export function makeJwtToken(payload: string | object, privateKey: string, expiresIn: JwtExpiresInType) {
  const jwtToken = sign(payload, privateKey, { expiresIn });
  return jwtToken;
}
