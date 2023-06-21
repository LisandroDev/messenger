import { User } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedError } from '@/middlewares/errors/specific-handler';

class TokenManager {
  public generateToken(userId: User['id'], userEmail: User['email']) {
    return jwt.sign(
      { userId: userId, userEmail: userEmail },
      process.env.TOKEN_SECRET as string,
      { expiresIn: '24h' }
    );
  }

  public authenticateToken(token: string): JwtPayload {
    const decoded = jwt.verify(
      token,
      process.env.TOKEN_SECRET as string
    ) as JwtPayload;
    if (!decoded) {
      throw new UnauthorizedError('Invalid Token');
    }
    return decoded;
  }
}

export default new TokenManager();
