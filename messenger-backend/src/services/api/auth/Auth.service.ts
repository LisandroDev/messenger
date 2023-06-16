import bcrypt from 'bcrypt';
import prisma from '@/database/client'

// Models 
import { User } from '@prisma/client';

export class AuthService {
   
    private saltRounds = 10;
    

    public async registerUser(email: string, password: string, name: string): Promise<User>{
            
            const hashedPassword = await bcrypt.hash(password, this.saltRounds);
        
            const newUser = await prisma.user.create({data: {email: email, password: hashedPassword, name: name}})
    
            return newUser;

    }

    public async loginUser(): Promise<void>{
        return
    }

    public async logoutUser(): Promise<void>{
        return
    }
}




