import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/specific-handler";
import TokenManager from '@/utils/token.utils'

export function authenticateToken(req: Request, res:Response, next: NextFunction){
    const authHeader = req.headers['authorization'];
    const cookie = req.headers['cookie']?.split('jwt_token=')[1]
    const token = authHeader && authHeader.split(' ')[1]

    if(!cookie){
        throw new UnauthorizedError('Unauthorized')
    }

    const tokenAuthenticated = TokenManager.authenticateToken(cookie);

    if(tokenAuthenticated){
        req.userId = tokenAuthenticated.userId;
    }
    
    next()
}