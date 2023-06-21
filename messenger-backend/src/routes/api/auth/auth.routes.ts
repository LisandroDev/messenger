import express from 'express';

// Types

import { Response, Request } from 'express';

// Controllers
import AuthController from '@/controllers/api/auth/Auth.controller';

const router = express.Router();

router.post('/register', (req: Request, res: Response) =>
  AuthController.register(req, res)
);

router.post('/login', (req: Request, res: Response) =>
  AuthController.login(req, res)
);

router.post('/logout', (req: Request, res: Response) =>
  AuthController.logout(req, res)
);

export default router;
