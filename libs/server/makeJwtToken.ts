import { sign } from 'jsonwebtoken';
import { JwtExpiresInType } from '../domain/jwt';

export default function makeJwtToken(payload: string | object, expiresIn: JwtExpiresInType) {
  const jwtToken = sign(payload, process.env.JWT_PRIVATE_KEY as string, { expiresIn });
  return jwtToken;
}
