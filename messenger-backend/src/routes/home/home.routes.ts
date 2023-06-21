import express from 'express';


import { Response, Request } from 'express';
import { authenticateToken } from '@/middlewares/auth/authenticate';

const router = express.Router();

router.use(authenticateToken)

router.get('/', authenticateToken, (req: Request, res: Response) =>
  res.json({ home: '/home' })
);

router.get('/contacts', authenticateToken, (req: Request, res: Response) =>
  res.json({ home: '/contacts', userId: req.userId})
);

export default router