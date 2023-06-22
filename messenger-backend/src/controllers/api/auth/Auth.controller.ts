import { Request, Response } from 'express';

// Services
import { AuthService } from '@/services/api/auth/Auth.service';

// Custom errors
import { BadRequestError } from '@/middlewares/errors/specific-handler';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public async register(req: Request, res: Response): Promise<Response> {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      throw new BadRequestError('Missing Data');
    }

    const user = await this.authService.registerUser(email, password, name);

    if (!user) {
      throw new Error('Fail at user creation!');
    }

    return res.json({ user });
  }

  public async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError('Missing Data');
    }

    const user = await this.authService.loginUser(email, password);

    return res
      .status(200)
      .cookie('jwt_token', user.token, { httpOnly: true, domain: process.env.AUTH_DOMAIN })
      .send(user);
  }

  public async logout(req: Request, res: Response): Promise<Response> {
    return res
      .status(200)
      .clearCookie('jwt_token')
      .json({ message: 'Cookie cleared' });
  }
}

export default new AuthController();
