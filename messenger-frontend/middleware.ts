import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest){
    const jwt_token = request.cookies.get('jwt_token');
    
    if(!jwt_token && request.nextUrl.pathname == '/home'){
        return NextResponse.redirect(new URL('/', request.url))
    }

    if(jwt_token && request.nextUrl.pathname == '/'){
        return NextResponse.redirect(new URL('/home', request.url))
    }

    return
    
}

export const config = {
    matcher: ['/home','/']
}

