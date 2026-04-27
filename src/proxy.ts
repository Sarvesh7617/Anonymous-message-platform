import { getToken } from 'next-auth/jwt';
import { NextResponse, NextRequest } from 'next/server'
 

const proxy=async (req: NextRequest)=> {
    const {pathname}=req.nextUrl
    const allowRoute=[
        "/sign-in", 
        "/sign-up",
        "/verify",
        "/",
        "/favicon.ico",
        "_next"
    ]

    if(allowRoute.some(path=>pathname.startsWith(path)))
        return NextResponse.next();

    else
    {
        let token=await getToken({req,secret:process.env.NEXTAUTH_SECRET})
        if(!token)
        {
            const loginUrl=new URL("/sign-in ",req.url)
            loginUrl.searchParams.set("callbackUrl",req.url)
            return NextResponse.redirect(loginUrl)
        }
        return NextResponse.next();
    }
}


export default proxy;


export const config = {
  matcher: [
    // Exclude API routes, static files, image optimizations, and .png files
    '/((?!api|_next/static|_next/image|favicon.ico|node_module|.*\\.png$).*)',
    '/dashboard'
  ],
}
