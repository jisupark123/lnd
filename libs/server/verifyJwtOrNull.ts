import { verify } from 'jsonwebtoken';

export default function verifyJwtOrNull<T>(token: string) {
  try {
    return verify(token, process.env.JWT_PRIVATE_KEY as string) as T;
  } catch {
    return null;
  }
}
