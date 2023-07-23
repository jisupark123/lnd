import { AuthorityName } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';

// payload가 하나일 때
// {
//   userId: 4,
//   iat: 1689817377,
//   exp: 1689990177
// }

// payload가 두개 이상일 때
// {
//   jwtPayload: { userId: 4, authorities: [] },
//   iat: 1689817377,
//   exp: 1689990177
// }

// 따라서 payload가 두개 이상이므로 
// JwtDecodedType<JwtPayloadType> 
// 위처럼 사용한다.

export interface JwtPayloadType {
  userId: number;
  authorities: AuthorityName[];
}

export interface JwtDecodedType<T> extends JwtPayload {
  jwtPayload: T;
}
