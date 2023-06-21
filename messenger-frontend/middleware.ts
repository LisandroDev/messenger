import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest){
    const jwt_token = request.cookies.get('jwt_token');
    
    if(!jwt_token){
        return NextResponse.redirect(new URL('/', request.url))
    }

    
}

export const config = {
    matcher: '/home'
}

