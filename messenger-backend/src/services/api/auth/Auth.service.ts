import bcrypt from 'bcrypt';
import prisma from '@/database/client';

// Token

import TokenManager from '@/utils/token.utils';

// Models
import { User } from '@prisma/client';

// Errors
import { UnauthorizedError } from '@/middlewares/errors/specific-handler';
import { Jwt } from 'jsonwebtoken';

export class AuthService {
  private saltRounds = 10;

  public async registerUser(
    email: string,
    password: string,
    name: string
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

    const newUser = await prisma.user.create({
      data: { email: email, password: hashedPassword, name: name },
    });

    return newUser;
  }

  public async loginUser(
    req_email: string,
    req_password: string
  ): Promise<{ name: string; token: string}> {
    const user = await prisma.user.findUnique({ where: { email: req_email } });

    if (!user) {
      throw new UnauthorizedError('Invalid Credentials');
    }

    const passwordCheck = bcrypt.compare(req_password, user.password);

    if (!passwordCheck) {
      throw new UnauthorizedError('Invalid Credentials');
    }

    const token = TokenManager.generateToken(user.id, user.email);

    return { name: user.name, token };
  }

  public async logoutUser(): Promise<void> {
    return;
  }
}
