import express from 'express';
// Controllers
import AuthController from '@/controllers/api/auth/Auth.controller';
import { Response, Request } from 'express';


const router = express.Router();

// Auth Routes

router.post('/auth/register', (req: Request, res: Response) => AuthController.register(req, res ));

export default router;
