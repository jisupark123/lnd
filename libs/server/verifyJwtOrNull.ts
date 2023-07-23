import { JwtDecodedType } from '@/types/jwtPayloadType';
import { verify } from 'jsonwebtoken';

export default function verifyJwtOrNull<T>(token: string) {
  try {
    const decoded = verify(token, process.env.JWT_PRIVATE_KEY as string) as JwtDecodedType<T>;
    return decoded.jwtPayload;
  } catch {
    return null;
  }
}
